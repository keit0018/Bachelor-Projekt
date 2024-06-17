import { CallClient } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';

let callAgentInstance = null;
let callClientInstance = null;

export const getCallAgentInstance = async (token, displayName) => {
  if (!callAgentInstance) {
    const callClient = new CallClient();
    const tokenCredential = new AzureCommunicationTokenCredential(token);
    callClientInstance = callClient; // Save callClient instance
    callAgentInstance = await callClient.createCallAgent(tokenCredential, { displayName });
  }
  return { callAgentInstance, callClientInstance };
};

export const disposeCallAgentInstance = async () => {
  console.log("call agent on leaving call: ", callAgentInstance);
  if (callAgentInstance) {
    await callAgentInstance.dispose();
    callAgentInstance = null;
    callClientInstance = null;
  }
};