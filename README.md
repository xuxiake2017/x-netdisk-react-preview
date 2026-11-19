# x-netdisk React Web 客户端

前端已迁移到 React 18、TypeScript 和 Vite。为保持原页面布局，UI 层继续使用 Material UI 4。

环境要求：Node.js 20.19+、pnpm 10+。

## 开发

```bash
pnpm install
pnpm dev
```

打开 <http://localhost:3000>。开发服务器会把 `/netdisk` 请求代理到 `http://localhost:8080`。

## 检查与构建

```bash
pnpm typecheck
pnpm build
pnpm preview
```

生产构建输出到 `dist`。生产环境接口地址默认是 `http://127.0.0.1:8080/netdisk`，可通过 `VITE_API_BASE_URL` 覆盖。

## TypeScript 迁移说明

数据层、Redux、配置和应用入口已纳入 TypeScript 检查。部分旧 UI 与上传/预览组件仍依赖 PropTypes 和不兼容 React 18 的第三方类型，暂以文件级 `@ts-nocheck` 保持行为不变，后续可按模块逐步补齐类型并移除标记。


## 截图

![登录](https://github.com/xuxiake2017/x-netdisk-react-preview/blob/master/pic/1.JPG?raw=true)

![主界面](https://github.com/xuxiake2017/x-netdisk-react-preview/blob/master/pic/2.JPG?raw=true)

## 特别感谢

- [Cloudreve](https://github.com/Cloudreve/Cloudreve)，主要样式参考该开源项目。
