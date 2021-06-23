const webpack = require('webpack')
const ora = require('ora')
const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const {
    execSync
} = require('child_process');
const webpackConfig = require('../webpack.config')


const spinner = ora(`building for ${process.env.NODE_ENV}...`)

spinner.start()
webpack(webpackConfig, (err, stats) => {
    if (err) throw (err)
    if (stats.hasErrors()) {
        console.log(chalk.red('  Build failed with errors.\n'))
        console.log(stats.compilation.errors)
        process.exit(1)
    }
    const keySrcDir = path.resolve(__dirname, '../src/key')
    const keyTargetDir = path.resolve(__dirname, '../dist/key')
    const logsSrc = path.resolve(__dirname, '../src/logs')
    const logsTarget = path.resolve(__dirname, '../dist/logs')
    if (!fs.existsSync(keyTargetDir)) {
        fs.mkdirSync(keyTargetDir)
    }
    if (!fs.existsSync(logsTarget)) {
        fs.mkdirSync(logsTarget)
    }
    const targetHttpLogPath = path.resolve(logsTarget, 'httpLog')
    if (!fs.existsSync(targetHttpLogPath)) {
        fs.mkdirSync(targetHttpLogPath)
    }
    const targetTransferPath = path.resolve(logsTarget, 'transferLog')
    if (!fs.existsSync(targetTransferPath)) {
        fs.mkdirSync(targetTransferPath)
    }
    copyDir(keySrcDir, keyTargetDir)
    copyDir(path.resolve(logsSrc, 'httpLog'), targetHttpLogPath)
    console.log(chalk.cyan('  Build complete.\n'))
    spinner.stop()
})


function copyDir(from, to) {
  const ishasFromDir = fs.existsSync(from)
  if (ishasFromDir) {
    const keysList = fs.readdirSync(from);
    keysList.forEach(file => {
      const flag = fs.existsSync(path.resolve(to, file))
      if (!flag) {
        const origin = path.resolve(from, file)
        const target = path.resolve(to, file)
        execSync(`cp ${origin} ${target}`)
      }
    })
  }
}