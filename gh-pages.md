#gh-pages 发布

## 发布流程

1. cd dist
2. git init
3. git checkout --orphan gh-pages
4. git add .
5. git commit -m "xxxxx"
6. git remote add origin https://github.com/baimifan2017/m-demo.git
7. git pull https://github.com/baimifan2017/m-demo.git gh-pages --allow-unrelated-histories
8. git push origin gh-pages
