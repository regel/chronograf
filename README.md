[![CircleCI](https://circleci.com/gh/loudml/chronograf.svg?style=svg)](https://circleci.com/gh/loudml/chronograf)

# What makes you TICK-L

## What is the TICK-L stack

Chronograf is an open-source web application written in Go and React.js that
provides the tools to visualize your monitoring data and easily create alerting
and automation rules.

Loud ML is an open-source AI application written in Python that provides the
tools to discover abnormal and normal patterns in time series datasets, without
the need for advanced AI knowledge.

Just hit 'Create Baseline' button in the data explorer.

For further information about Chronograf and Loud ML, see:
* https://github.com/influxdata/chronograf
* https://github.com/regel/loudml

## Configuration

### TLS/HTTPS Support

See
[Chronograf with TLS](https://github.com/influxdata/chronograf/blob/master/docs/tls.md)
for more information.

### OAuth Login

See
[Chronograf with OAuth 2.0](https://github.com/influxdata/chronograf/blob/master/docs/auth.md)
for more information.

### Advanced Routing

Change the default root path of the Chronograf server with the `--basepath`
option.

## Versions

The most recent version is the nightly Docker
[image](https://hub.docker.com/r/loudml/chronograf).

Spotted a bug or have a feature request? Please open
[an issue](https://github.com/loudml/chronograf/issues/new)!

## Installation

We recommend using using one of the Docker
[pre-built images](https://hub.docker.com/r/loudml/chronograf/tags). Then start
Chronograf using the usual docker-compose or kubectl commands.

By default, chronograf runs on port `8888`.

### With Docker

To get started right away with Docker, you can pull down our latest release:

```sh
docker pull loudml/chronograf:nightly
```

Or run docker-compose from this repository:
 
```sh
docker-compose pull
docker-compose up --build
```
