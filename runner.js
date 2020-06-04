#!/usr/bin/env node
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const jUnitBuilder = require('junit-report-builder');
const fs = require('fs')

const cmdOptions = [
    { name: 'filepath', alias: 'f', type: String },
    { name: 'level', alias: 'l', type: String },
    { name: 'output', alias: 'o', type: String },
    { name: 'help', alias: 'h', type: Boolean }
]

const sections = [
    {
        header: 'LambdaGuard JUnit',
        content: 'Generate JUnit Test Results from LambdaGuard security scan'
    },
    {
        header: 'Options',
        optionList: [
            {
                name: 'filepath',
                typeLabel: '{underline security.json}',
                description: 'File path to `security.json` from LambdaGuard'
            },
            {
                name: 'level',
                typelabel: '{underline high}',
                description: 'Level to flag as a test `failure`'
            },
            {
                name: 'output',
                typelabel: '{underline report.xml}',
                description: 'Change output path'
            },
            {
                name: 'help',
                description: 'Print this usage guide'
            }
        ]
    }
]

const options = commandLineArgs(cmdOptions)

if(options.help) {
    const usage = commandLineUsage(sections)
    console.log(usage)
}
else {
    var filePath = "security.json";
    var output = "junit.xml";
    var level = "high";
    if(options.filepath) {
        filePath = options.filepath;
    }
    if(options.output) {
        output = options.output;
    }
    if(options.level) {
        level = options.level;
    }

    console.info("Reading file...");
    var lgResultData = fs.readFileSync(filePath);
    var lgResult = JSON.parse(lgResultData);

    console.log("Generating jUnit report...");
    var suite = jUnitBuilder.testSuite().name('LambdaGuardSuite');
    for(var i = 0; i < lgResult.length; i++) {
        var result = lgResult[i];
        var textOptions = result.text.split('\n');
        if(textOptions.length != 2) {
            if(isFailure(result, level)) {
                suite.testCase()
                    .className(result.lambda)
                    .name(result.text)
                    .failure();
            }
            else {
                suite.testCase()
                    .className(result.lambda)
                    .name(result.text);
            }
        } else {
            if(isFailure(result, level)) {
                suite.testCase()
                    .className(result.lambda)
                    .name(textOptions[0])
                    .standardOutput(textOptions[1])
                    .failure();
            }
            else {
                suite.testCase()
                    .className(result.lambda)
                    .name(textOptions[0])
                    .standardOutput(textOptions[1]);
            }
        }
    }
    jUnitBuilder.writeTo(output);
    console.log("jUnit report generated");
}

function isFailure(result, level) {
    if(levelNumber(result.level) >= levelNumber(level)) {
        return true;
    }

    return false;
}

function levelNumber(level) {
    switch(level) {
        case "high":
            return 3;
        case "medium":
            return 2;
        case "low":
            return 1;
        case "info":
            return 0;
        default:
            return -1;
    }
}