import {
  IWireMockRequest,
  IWireMockResponse,
  WireMock,
} from "wiremock-captain";

interface IMockedRequest {
  request: IWireMockRequest;
  response: IWireMockResponse;
}

const wiremockEndpoint = "http://localhost:8080";
const wiremock = new WireMock(wiremockEndpoint);

const loginUrlStub: IMockedRequest = {
  request: {
    method: "GET",
    endpoint: "/login",
  },

  response: {
    status: 302,
    headers: {
      Location: "http://localhost:8080/pretend_access_token", // <- this is where you would return to the original app with your veary real 'token'
    },
  },
};
const pretendAccessTokenStub: IMockedRequest = {
  request: {
    method: "GET",
    endpoint: "/pretend_access_token",
  },
  response: {
    status: 200,
    body: {
      access_token: "pretend_access_token",
      refresh_token: "pretend_refresh_token",
      token_type: "Bearer",
      expires_in: 3600,
    },
  },
};

const refreshTokenStub: IMockedRequest = {
  request: {
    method: "POST",
    endpoint: "/refresh_token",
    body: {
      refresh_token: "pretend_refresh_token",
    },
  },
  response: {
    status: 200,
    body: {
      access_token: "new_pretend_access_token",
      refresh_token: "new_pretend_refresh_token",
      token_type: "Bearer",
      expires_in: 3600,
    },
  },
};

const stubs: IMockedRequest[] = [
  loginUrlStub,
  pretendAccessTokenStub,
  refreshTokenStub,
];

console.log("Setting up stubs...");

stubs.forEach((stub) => {
  wiremock.register(stub.request, stub.response);
});

console.log("Mock server ready!");
