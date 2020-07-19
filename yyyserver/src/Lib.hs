{-# LANGUAGE OverloadedStrings #-}
module Lib where

import Control.Monad (forever)
import Control.Exception (finally)
import Data.IORef
import Data.Text (Text, unpack)
import Network.HTTP.Types (hContentType)
import Network.HTTP.Types.Status (status200)
import Network.Wai (Application, Middleware, responseFile, pathInfo)
import Network.Wai.Handler.WebSockets (websocketsOr)
import qualified Network.Wai.Handler.Warp as Warp
import qualified Network.WebSockets as WS
import Network.Wai.Middleware.HttpAuth

type Client = (Int, WS.Connection)

broadcast :: Text -> [Client] -> IO()
broadcast msg cs = do
    print msg
    mapM_ (flip WS.sendTextData msg) . map snd $ cs

addClient :: WS.Connection -> [Client] -> ([Client], Int)
addClient conn cs = let i = if null cs then 0 else maximum (map fst cs) + 1
                    in ((i,conn):cs, i)

removeClient :: Int -> [Client] -> ([Client], ())
removeClient i cs = (filter ((/=i).fst) cs , ())

chat :: IORef [Client] -> WS.ServerApp
chat ref pending = do
    conn <- WS.acceptRequest pending
    identifier <- atomicModifyIORef ref (addClient conn)
    flip finally (disconnect identifier) $ forever $ do
        msg <- WS.receiveData conn
        conns <- readIORef ref
        broadcast msg conns
    where
        disconnect identifier = atomicModifyIORef ref (removeClient identifier)

app :: Application
app req respond = do
    putStrLn $ "request log : " ++ (show $ pathInfo req)
    case pathInfo req of
        [] -> respond $ serveFile "text/html" "html/index.html"
        ["js", js] -> respond.serveFile "text/javascript" $ "js/" ++ unpack js
        ["css", css] -> respond.serveFile "text/css" $ "css/" ++ unpack css
        ["img", img] -> respond.serveFile "image/png" $ "img/" ++ unpack img

serveFile mime filePath = responseFile status200 [("Content-Type",mime)] filePath Nothing

authorize :: Middleware
authorize = basicAuth (\_ p -> pure $ p == "yyy") "BasicAuth"

runYYYServer :: IO ()
runYYYServer = do
    let port = 3000
    let setting = Warp.setPort port Warp.defaultSettings
    putStrLn $ "YYY server is listening at http://localhost:" ++ show port ++ "/"
    ref <- newIORef []
    Warp.runSettings setting $ websocketsOr WS.defaultConnectionOptions (chat ref) (authorize app)


someFunc :: IO ()
someFunc = runYYYServer