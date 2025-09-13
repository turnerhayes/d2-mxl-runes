import express from "express";
// import proxy from "express-http-proxy";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "node:path";
const app = express();

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../index.html"));
});
app.use("/src/css", express.static(path.resolve(__dirname, "../src/css")));
app.use("/dist", express.static(path.resolve(__dirname, "../dist")));

app.use("/runewords", express.static(path.resolve(__dirname, "../runewords")));

app.use("/proxy", createProxyMiddleware({
    target: "https://docs.median-xl.com",
    changeOrigin: true,
    pathRewrite: {
        "^/proxy": ""
    }
}));

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
