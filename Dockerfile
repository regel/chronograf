FROM node:12.14.0 as builder

RUN curl https://dl.google.com/go/go1.13.6.linux-amd64.tar.gz | tar xvz
RUN mv go /usr/local

ENV GOROOT /usr/local/go
ENV GOPATH /app
ENV GOBIN $GOPATH/bin
ENV PATH $GOPATH/bin:$GOROOT/bin:$PATH

WORKDIR /app
RUN mkdir -p $GOBIN

RUN curl https://raw.githubusercontent.com/golang/dep/v0.5.4/install.sh | sh

RUN mkdir -p /app/src/github.com/influxdata
COPY . /app/src/github.com/influxdata/chronograf
RUN cd /app/src/github.com/influxdata/chronograf && \
    rm -rf vendor $GOPATH/pkg && \
    dep ensure -v
RUN cd /app/src/github.com/influxdata/chronograf && make dep
RUN cd /app/src/github.com/influxdata/chronograf && make

FROM gliderlabs/alpine
MAINTAINER Sebastien Leger <sebastien@loudml.io>

RUN apk add --update ca-certificates && \
    rm /var/cache/apk/*

ENV BUILDDIR /app/src/github.com/influxdata/chronograf

COPY --from=builder $BUILDDIR/chronograf /usr/bin/chronograf
COPY --from=builder $BUILDDIR/chronoctl /usr/bin/chronoctl
ADD canned/*.json /usr/share/chronograf/canned/
ADD LICENSE /usr/share/chronograf/LICENSE
ADD agpl-3.0.md /usr/share/chronograf/agpl-3.0.md

EXPOSE 8888
VOLUME ["/usr/share/chronograf", "/var/lib/chronograf"]

CMD ["/usr/bin/chronograf", "-b", "/var/lib/chronograf/chronograf-v1.db", "-c", "/usr/share/chronograf/canned"]
