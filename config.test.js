"use strict";

describe("config can come from env", function () {
  test("works", function() {
    process.env.SECRET_KEY = "abc";
    process.env.PORT = "5000";
    process.env.DATABASE_URL = "postgresql:///jobly_test";
    process.env.NODE_ENV = "test";
    // good one :) was not set to test , was set to other

    const config = require("./config");
    expect(config.SECRET_KEY).toEqual("abc");
    expect(config.PORT).toEqual(5000);
    expect(config.getDatabaseUri()).toEqual("postgresql:///jobly_test");
    expect(config.BCRYPT_WORK_FACTOR).toEqual(1);

    delete process.env.SECRET_KEY;
    delete process.env.PORT;
    delete process.env.BCRYPT_WORK_FACTOR;
    delete process.env.DATABASE_URL;

    expect(config.getDatabaseUri()).toEqual('postgresql:///jobly_test');
    process.env.NODE_ENV = "test";

  });
})

