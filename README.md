# LambdaGuard JUnit Generator

[![npm version](https://badge.fury.io/js/lambdaguardjunit.svg)](https://badge.fury.io/js/lambdaguardjunit)

Convert the `security.json` output from LambdaGuard to a JUnit test result, to be used with CI pipelines.

## Requirements
You know how to use an awesome project called [LambdaGuard](https://github.com/Skyscanner/LambdaGuard)

## Install

`npm install -g lambdaguardjunit`

## How to Use

`lambdaguardjunit --help`

```
LambdaGuard JUnit

  Generate JUnit Test Results from LambdaGuard security scan 

Options

  --filepath security.json   File path to `security.json` from LambdaGuard 
  --level                    Level to flag as a test `failure`             
  --output                   Change output path                            
  --help                     Print this usage guide  
```

`lambdaguardjunit -f path/to/lambdaguard/output/security.json -l high -o path/to/junit/report.xml`

And that's it.  Super simple.  Super easy.