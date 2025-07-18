import { cp } from "node:fs/promises";
import { promisify } from "node:util";
import { exec } from "node:child_process";

let npmOtp = "";

const retrieveOTP = () => {
  const otpArg = "--otp=";

  for (const argv of process.argv) {
    if (argv.startsWith(otpArg)) {
      npmOtp = argv.replace(otpArg, "");
    }
  }

  if (!npmOtp) {
    throw new Error(
      "❌ Please provide '--otp={otp-npm-code-from-authenticator-app}' argument"
    );
  }
};

const compileTs = () =>
  promisify(exec)("npm run tsc").then(() =>
    console.log("✅ typescript compiled")
  );
const copyNativeToDist = () =>
  cp("./src", "./dist/src", { recursive: true }).then(() =>
    console.log("✅ c++ sources copied to dist")
  );
const copyBlazeLibToDist = () =>
  cp("./deps", "./dist/deps", { recursive: true }).then(() =>
    console.log("✅ c++ deps sources copied to dist")
  );
const copyNativeBuildInstructions = () =>
  cp("./CMakeLists.txt", "./dist/CMakeLists.txt", { recursive: true }).then(
    () => console.log("✅ CMakeLists.txt copied to dist")
  );
const copyReadme = () =>
  cp("./README.md", "./dist/README.md", { recursive: true }).then(() =>
    console.log("✅ README.md copied to dist")
  );
const npmPublish = () =>
  promisify(exec)(`npm publish --otp=${npmOtp}`, { cwd: "./dist/" })
    .then((r) => console.log(r.stderr ?? r.stdout))
    .then(() => console.log("✅ published to npm"));

retrieveOTP();
await compileTs();
await copyNativeToDist();
await copyBlazeLibToDist();
await copyNativeBuildInstructions();
await copyReadme();
await npmPublish();
