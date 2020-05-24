const assert = require("assert");
const testMngr = require("test/testManager");

describe("Itinary No Auth", function () {
  let client;
  before(async () => {
    await testMngr.start();
    client = testMngr.client("bob");
  });
  after(async () => {
    await testMngr.stop();
  });

  it("should get a 401 when getting all itinaries", async () => {
    try {
      let itinaries = await client.get("v1/myItinary");
      assert(itinaries);
    } catch (error) {
      assert.equal(error.response.status, 401);
      assert.equal(error.response.data, "Unauthorized");
    }
  });
});

describe("Itinary", function () {
  let client;
  before(async () => {
    await testMngr.start();
    client = testMngr.client("alice");
    await client.login();
  });
  after(async () => {
    await testMngr.stop();
  });
  it("should create a itinary", async () => {
    const input = {
      from: "Santa Veronica",
      to: "Loma de Arena",
    };
    let itinary = await client.post("v1/myItinary", input);
    assert(itinary);
    assert(itinary.user_id);
    assert.equal(itinary.from, input.from);
    assert.equal(itinary.to, input.to);
  });
  it("should update an itinary", async () => {
    const inputNew = {
      from: "Santa Veronica",
      to: "Loma de Arena",
    };
    const newItinary = await client.post("v1/myItinary", inputNew);
    const inputUpdated = {
      from: "Puerto Velero",
    };
    const updatedItinary = await client.patch(
      `v1/myItinary/${newItinary.id}`,
      inputUpdated
    );
    assert.equal(updatedItinary.from, inputUpdated.from);
  });
  it.only("should delete a itinary", async () => {
    const inputNew = {
      from: "Santa Veronica",
      to: "Loma de Arena",
    };
    const newItinary = await client.post("v1/myItinary", inputNew);
    const itinariesBeforeDelete = await client.get("v1/myItinary");
    await client.delete(`v1/itinary/${newItinary.id}`);
    const itinariesAfterDelete = await client.get("v1/myItinary");
    assert.equal(itinariesBeforeDelete.length, itinariesAfterDelete.length + 1);
  });
  it("should get all itinaries", async () => {
    let itinaries = await client.get("v1/myItinary");
    assert(itinaries);
    assert(Array.isArray(itinaries));
  });
  it("should get one itinary", async () => {
    let itinary = await client.get("v1/myItinary/1");
    assert(itinary);
    assert(itinary.user_id);
  });
  it("should get 404 when the itinary is not found", async () => {
    try {
      let itinaries = await client.get("v1/myItinary/123456");
      assert(itinaries);
    } catch (error) {
      assert(error.body.error);
      assert.equal(error.body.error.name, "NotFound");
      assert.equal(error.statusCode, 404);
    }
  });
});
