#!/usr/bin/env node

/**
 * Comprehensive test runner for FindWorkAI frontend
 * Runs both unit tests and E2E tests with coverage reporting
 */

const { spawn } = require('child_process')
const chalk = require('chalk')

// ANSI color codes fallback if chalk is not available
const colors = {
  green: (text) => chalk ? chalk.green(text) : `\x1b[32m${text}\x1b[0m`,
  red: (text) => chalk ? chalk.red(text) : `\x1b[31m${text}\x1b[0m`,
  yellow: (text) => chalk ? chalk.yellow(text) : `\x1b[33m${text}\x1b[0m`,
  blue: (text) => chalk ? chalk.blue(text) : `\x1b[34m${text}\x1b[0m`,
  bold: (text) => chalk ? chalk.bold(text) : `\x1b[1m${text}\x1b[0m`,
}

function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    console.log(colors.blue(`\n📦 Running: ${command} ${args.join(' ')}\n`))
    
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    })

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Command failed with exit code ${code}`))
      } else {
        resolve()
      }
    })

    child.on('error', (error) => {
      reject(error)
    })
  })
}

async function runTests() {
  console.log(colors.bold(colors.green(`
╔════════════════════════════════════════════╗
║     FindWorkAI - Comprehensive Testing      ║
╚════════════════════════════════════════════╝
  `)))

  const startTime = Date.now()
  let unitTestsPassed = false
  let e2eTestsPassed = false

  try {
    // 1. Run linting
    console.log(colors.yellow('\n🔍 Step 1: Running ESLint...\n'))
    await runCommand('npm', ['run', 'lint'])
    console.log(colors.green('✅ Linting passed!\n'))
  } catch (error) {
    console.log(colors.yellow('⚠️  Linting has warnings or errors. Continuing...\n'))
  }

  try {
    // 2. Run TypeScript type checking
    console.log(colors.yellow('\n📝 Step 2: Running TypeScript type checking...\n'))
    await runCommand('npm', ['run', 'type-check'])
    console.log(colors.green('✅ Type checking passed!\n'))
  } catch (error) {
    console.log(colors.red('❌ Type checking failed!\n'))
    console.error(error.message)
  }

  try {
    // 3. Run unit tests with coverage
    console.log(colors.yellow('\n🧪 Step 3: Running unit tests with coverage...\n'))
    await runCommand('npm', ['run', 'test:ci', '--', '--coverage', '--coverageReporters=text', '--coverageReporters=lcov', '--coverageReporters=html'])
    unitTestsPassed = true
    console.log(colors.green('✅ Unit tests passed!\n'))
  } catch (error) {
    console.log(colors.red('❌ Unit tests failed!\n'))
    console.error(error.message)
  }

  try {
    // 4. Build the application
    console.log(colors.yellow('\n🏗️  Step 4: Building the application...\n'))
    await runCommand('npm', ['run', 'build'])
    console.log(colors.green('✅ Build successful!\n'))
  } catch (error) {
    console.log(colors.red('❌ Build failed!\n'))
    console.error(error.message)
  }

  try {
    // 5. Run E2E tests
    console.log(colors.yellow('\n🎭 Step 5: Running E2E tests with Playwright...\n'))
    await runCommand('npx', ['playwright', 'test', '--reporter=list'])
    e2eTestsPassed = true
    console.log(colors.green('✅ E2E tests passed!\n'))
  } catch (error) {
    console.log(colors.red('❌ Some E2E tests failed!\n'))
    console.error(error.message)
  }

  // Summary
  const endTime = Date.now()
  const duration = ((endTime - startTime) / 1000).toFixed(2)
  
  console.log(colors.bold('\n' + '='.repeat(50)))
  console.log(colors.bold('📊 TEST SUMMARY'))
  console.log('='.repeat(50))
  
  console.log(`\n⏱️  Total time: ${duration}s`)
  console.log(`\n📋 Results:`)
  console.log(`  • Unit Tests: ${unitTestsPassed ? colors.green('✅ PASSED') : colors.red('❌ FAILED')}`)
  console.log(`  • E2E Tests: ${e2eTestsPassed ? colors.green('✅ PASSED') : colors.red('❌ FAILED')}`)
  
  if (unitTestsPassed && e2eTestsPassed) {
    console.log(colors.green('\n🎉 All tests passed successfully!'))
  } else {
    console.log(colors.yellow('\n⚠️  Some tests failed. Please review the output above.'))
  }

  // Open coverage report
  console.log(colors.blue('\n📈 Coverage report generated at: coverage/index.html'))
  console.log(colors.blue('📊 Playwright report: npx playwright show-report\n'))
}

// Run the tests
runTests().catch((error) => {
  console.error(colors.red('\n❌ Test runner encountered an error:'))
  console.error(error)
  process.exit(1)
})
