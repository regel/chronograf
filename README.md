# Chronograf + LoudML extension

This is a fork of Chronograf that embeds a LoudML extension.

For further information about Chronograf and LoudML, see:
* https://github.com/influxdata/chronograf
* https://github.com/regel/loudml

Chronograf is an open-source web application written in Go and React.js that
provides the tools to visualize your monitoring data and easily create alerting
and automation rules.

## Build from sources

* Chronograf works with go 1.8.x+, node 6.x/7.x, and yarn 0.18+.
* Chronograf requires [Kapacitor](https://github.com/influxdata/kapacitor)
  1.2.x+ to create and store alerts.

1. [install LoudML](http://loudml.io/guide/en/loudml/reference/current/setup.html)
1. [Install Go](https://golang.org/doc/install)
1. [Install Node and NPM](https://nodejs.org/en/download/)
1. [Install yarn](https://yarnpkg.com/docs/install)
1. [Setup your GOPATH](https://golang.org/doc/code.html#GOPATH)
1. Get Chronograf sources
    ```bash
    go get github.com/influxdata/chronograf
    ```
1. Setup `github.com/regel/chronograf` as remote:
    ```bash
    cd src/github.com/influxdata/chronograf
    git remote add regel git@github.com:regel/chronograf.git
    ```
1. Switch to `regel/loudml` branch:
    ```bash
    git fetch regel
    git checkout -b loudml regel/loudml
    ```
1. Then, you can build Chronograf with LoudML extension:

   ```bash
   make
   ```

To build the Docker image, execute:
```bash
make docker
```

To start Chronograf in development mode:
```bash
cd chronograf/ui
npm install
npm build
yarn start:hmr
```
