const withTM = require("next-transpile-modules")([
  "chakra-ui-datepicker",
  "core",
]);

module.exports = withTM({
  reactStrictMode: true,
});
