const SibApiV3Sdk = require("sib-api-v3-sdk");
const env = require("../../config/env.config");

async function sendOTP(email, otp) {
  const client = SibApiV3Sdk.ApiClient.instance;
  const apiKey = client.authentications["api-key"];

  apiKey.apiKey = env.BREVO_API_KEY;

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const sender = {
    name: env.BREVO_SENDER_NAME,
    email: env.BREVO_SENDER_MAIL,
  };

  const receivers = [{ email }];

  await apiInstance.sendTransacEmail({
    sender,
    to: receivers,
    templateId: Number(env.BREVO_OTP_TEMPLATE_ID),
    params: {
      otp,
    },
  });
}

module.exports = {
  sendOTP,
};
