const opentelemetry = require('@opentelemetry/sdk-node');
const { BasicTracerProvider, SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');
const {
  OTLPTraceExporter,
} = require('@opentelemetry/exporter-trace-otlp-grpc');
const {
  OTLPMetricExporter,
} = require('@opentelemetry/exporter-metrics-otlp-grpc');
const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');
const { Resource } = require("@opentelemetry/resources")
const {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION
} = require("@opentelemetry/semantic-conventions")
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');

// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const sdk = new opentelemetry.NodeSDK({
  resource: new Resource({
    [ATTR_SERVICE_NAME]: process.env.OTLP_SERVICE_NAME,
    [ATTR_SERVICE_VERSION]: '0.1.0',
  }),
  traceExporter: new OTLPTraceExporter({
    // optional - default url is http://localhost:4318/v1/traces
    url: process.env.OTLP_EXPORTER_ENDPOINT ,
    // optional - collection of custom headers to be sent with each request, empty by default
    headers: {},

  }),
//   metricReader: new PeriodicExportingMetricReader({
//     exporter: new OTLPMetricExporter({
//       url: '<your-otlp-endpoint>/v1/metrics', // url is optional and can be omitted - default is http://localhost:4318/v1/metrics
//       headers: {}, // an optional object containing custom headers to be sent with each request
//       concurrencyLimit: 1, // an optional limit on pending requests
//     }),
//   }),
  instrumentations: [getNodeAutoInstrumentations()],
});

try {
  sdk.start();
}
catch (error) {
  console.error("Error starting OpenTelemetry SDK", error);
}

