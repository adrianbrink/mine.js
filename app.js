/**
 * Bootstrap the application
 * - create schedule to poll blockchain
 */

// const schedule = require('node-schedule')
global.config = require('./config')
const Sonar = require('./lib/sonar')

// magic numbers that need to be parsed via CLI
const contractAddress = '0xaB0b0c0dB8608D99172e8631C06AeBACbA4F4Cb9' // first private from docker-compose
const mineAddress = '0xf0FBE8eF307De70adAF6d17548f3937c6bb26c98' // 2nd rsprivate from docker-compose

const sonar = new Sonar(contractAddress, mineAddress)
const accounts = sonar.web3.eth.getAccounts()
  .then(a => console.log(a.slice(0, 10)))

async function checkForModels () {
  const modelCount = await sonar.getNumModels()
  console.log(`${modelCount} models found`)

  for (let modelId = 0; modelId < modelCount; modelId++) {
    const model = await sonar.getModel(modelId)
    console.log(`model#${modelId}: ${model.weightsAddress}`)
    if (model.gradientCount > 0) {
      const gradients = await sonar.getModelGradients(modelId, model.gradientCount - 1)
      console.log(`latest gradient#${gradients.id}: ${gradients.weightsAddress[0] + gradients.weightsAddress[1]}`)
    }
  }

  // setTimeout(checkForModels, config.pollInterval * 1000)
}

checkForModels()
