# REQUESTBIN APP

[![CI](https://github.com/Sharpedge2005/request-bin-app/actions/workflows/image.yml/badge.svg?branch=main)](https://github.com/Sharpedge2005/request-bin-app/actions/workflows/image.yml)

## **Build Setup**

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start
```

## **Env configuration for local setup:**

1. apiBaseURL - http://localhost:9091/request-bin
2. apiProxyURL - http://localhost:9091/request-bin

## **Docker Setup:**

Build Command for app image :

```bash
        docker build -t bsingh1904/request-bin-app:latest .

        docker build --build-arg APP_NAME=request-bin-app --build-arg APP_PORT=5000 -t bsingh1904/request-bin-app:latest .

        docker buildx build --push --platform linux/arm/v7,linux/arm64/v8,linux/amd64  --tag bsingh1904/request-bin-app:latest .
```

## **Certs**

### 1. Generating certs

- https://www.pluralsight.com/blog/software-development/selfcert-create-a-self-signed-certificate-interactively-gui-or-programmatically-in-net

- https://www.digicert.com/kb/ssl-support/openssl-quick-reference-guide.htm

### 2. Importing and conversion

- Run the following command to extract the private key:

``` bash
openssl pkcs12 -in [yourfile.pfx] -nocerts -out [yourfile.key]
```

You will be prompted to type the import password. Type the password that you used to protect your keypair when you created the .pfx file. You will be prompted again to provide a new password to protect the .key file that you are creating. Store the password to your key file in a secure place to avoid misuse.

- Run the following command to extract the certificate:

```bash
openssl pkcs12 -in [yourfile.pfx] -clcerts -nokeys -out [yourfile.crt]
```

- Run the following command to decrypt the private key:

```bash
openssl rsa -in [yourfile.key] -out [yourfile-decrypted.key]
```

Type the password that you created to protect the private key file in the previous step.

The .crt file and the decrypted and encrypted .key files are available in the path, where you started OpenSSL.
