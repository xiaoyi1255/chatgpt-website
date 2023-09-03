#!/bin/bash

# 运行 pnpm build 命令来构建项目，将生成的文件存储在 dist 目录中
pnpm build

rm -rf service/public

# 创建 service/public 目录（如果不存在）
mkdir -p service/public

# 使用 mv 命令将 dist 目录中的所有文件移动到 service/public 目录下
mv dist/* service/public/

# 输出完成消息
echo "文件已移动到 service/public 目录"




cd service
pnpm run stop
pnpm run deploy_release