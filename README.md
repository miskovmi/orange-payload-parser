# Orange Payload Parser
The application created as a part of recruiting process for Orange Slovakia.

It is a simple dokerizable REST API written in a JavaScript and launch by Node.js. It exposes some endpoints to offer parsing IoT device payload.

## API Authentication
Right authentication is necessary. API implements the basic authentication method with <user>:<password> credentials. Credentials will be published during a presentation.

## API Endpoints

|          |    |
---------- | -----
**Method** | `decoder()`
**Description** | Parse HEX payload string received by `hex_payload_string` and return decoded values as a JSON string.
**HTTP Bindings** | `GET` `/api/payload/{hex_payload_string}`
**Response type** | DecodedPayload

|          |    |
---------- | -----
**Method** | `decoder()`
**Description** | Parse HEX payload string received in a request body and return decoded values as a JSON string.
**HTTP Bindings** | `POST` `/api/payload`
**Request type** | PayloadRequest
**Response type** | DecodedPayload


## Messages


 Message | PayloadRequest
-------- | -----
**Type** | `JSON`

Message example:
```
{
  "payload": {
    "data" : "cbb2094e01a70109927fff"
  }
}
```


 Message | DecodedPayload
-------- | -----
**Type** | `JSON`

Message example:
```
{
  "payload": {
    "decode": {
      "status": "ok"
    },
    "data": {
      "battery": {
        "status": "Good",
        "voltage": {
          "unit": "mV",
          "value": 2994
        }
      },
      "temperature": {
        "unit": "°C",
        "value": 23.82
      },
      "humidity": {
        "unit": "%",
        "value": 42.3
      },
      "ext_temperature": {
        "unit": "°C",
        "value": 24.5
      }
    }
  }
}
```


