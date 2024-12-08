const { host, user, password, database, dialect, port } = {
    host : 'localhost',
    user : 'root',
    password : 'lwy123..',
    database : 'mydatabase',
    port: 3306,
    dialect: 'mysql'
}

const SequelizeAuto = require('sequelize-auto')

const options = {
  host,
  dialect,
  directory: 'models',  // 指定输出 models 文件的目录
  port,
  additional: {
    timestamps: false
  }
}

const auto = new SequelizeAuto(database, user, password, options)

auto.run(err => {
//   if (err) throw err
    console.log(err)
})

// yarn add sequelize-auto mysql2
// yarn install 
// package.json "scripts" "models": "node autosql.js"