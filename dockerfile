FROM oven/bun:latest
RUN mkdir -p /workdir
WORKDIR /workdir
COPY package.json /workdir
COPY bun.lockb /workdir/
RUN bun install
COPY . /workdir
CMD ["bun", "start"]