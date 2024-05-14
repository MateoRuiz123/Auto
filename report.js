const reporter = require("cucumber-html-reporter");

const options = {
  theme: "bootstrap",
  jsonFile: "report/cucumber_report.json", // Ruta del archivo JSON de resultados
  output: "report.html", // Nombre del archivo de reporte de salida
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: false, // Lanzar el reporte en un navegador después de generar
  metadata: {
    "App Version": "0.1.0",
    "Test Environment": "TESTING",
    Browser: "Chrome",
    Platform: "Windows 10",
    Executed: "Local",
  },
};

reporter.generate(options);
