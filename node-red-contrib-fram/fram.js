module.exports = function(RED) {
    "use strict";
    var I2C = require("i2c");

    // FRAM read node
    function framreadNode(n) {
        RED.nodes.createNode(this, n);

        this.address = "84"; // FRAM on netPI has a fixed I2C address of 84
        this.device = "/dev/i2c-1"; // FRAM on netPI is connected to I2C-1 bus
        this.amount = n.amount;
        this.offset = n.offset;
        var node = this;

        // open the I2C port first
        node.port = new I2C(parseInt(this.address), {device: this.device});

        node.on("input", function(msg) {

          // get arguments
          var offset = node.offset || msg.offset;
          var amount = node.amount || msg.amount;

          // divide offset into high and low byte
          var highoffset = (offset >> 8) & 0xff;
          var lowoffset = Buffer(1);
          lowoffset[0] = offset & 0xff;

          // write two bytes to set the offset address to be read from
          node.port.writeBytes(highoffset, lowoffset, function(err) {

              if (err) {
                node.error(err);
              } else {
                // read the amount of bytes specified
                node.port.readBytes(null, amount, function(err, res) {
                  if (err) {
                    node.error(err);
                  } else {
                    msg.payload = res;
                    node.send(msg);
                  }
                });
              }
            });
        });

        node.on("close", function() {
          node.port.close();
        });
    }
    RED.nodes.registerType("fram read", framreadNode);

    // FRAM write node 
    function framwriteNode(n) {
        RED.nodes.createNode(this, n);

        this.address = "84"; // FRAM on netPI has a fixed I2C address of 84
        this.device = "/dev/i2c-1"; // FRAM on netPI is connected to I2C-1 bus
        this.offset = n.offset;
        var node = this;

        // open the I2C port first
        node.port = new I2C(parseInt(this.address), {device: this.device});

        node.on("input", function(msg) {

          // get arguments
          var offset = node.offset || msg.offset;
          var amount = node.amount || msg.amount;

          // divide offset into high and low byte
          var highoffset = (offset >> 8) & 0xff;
          var lowoffset = Buffer(1);
          lowoffset[0] = offset & 0xff;

          // write two bytes offset first, then data
          node.port.writeBytes(highoffset, Buffer.concat([lowoffset,Buffer.from(msg.payload)]) , function(err) {
            if (err) {
              node.error(err);
             }
          });
        });

        node.on("close", function() {
          node.port.close();
        });
    }
    RED.nodes.registerType("fram write", framwriteNode);
}
