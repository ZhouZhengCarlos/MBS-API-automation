const cheerio = require("cheerio");

describe("Demo", () => {
  it("POST LOGIN", function () {
    const url = "https://idp-qa.motusclouds.com/auth/v1/tickets";
    cy.request({
      url,
      method: "POST",
      form: true,
      body: {
        username: "sloe",
        password: "1",
      },
    })
      .then((response) => {
        const $ = cheerio.load(response.body);
        const getTgtLink = $("form").attr("action");
        const getStUrl = getTgtLink; // -> remover
        return getStUrl;
      })
      .then((url) =>
        cy.request({
          url,
          method: "POST",
          form: true,
          body: {
            service: "https://idp-qa.motusclouds.com/bankingapi/",
          },
        })
      )
      .then((postStRequest) =>
        cy.request({
          url:
            "https://idp-qa.motusclouds.com/bankingapi/?ticket=" +
            postStRequest.body,
          method: "GET",
          form: true,
        })
      );
  });

  it("Customer List", function () {
    cy.request({
      method: "POST",
      url: "https://idp-qa.motusclouds.com/bankingapi/rest/driver/list",
      headers: {
        "content-type": "application/json",
      },
      body: {
        pageSize: 10,
        pageIndex: -1,
        sortColumn: "",
        sortOrder: "asc",
        fetchAllRecords: false,
        query: { searchText: "" },
      },
    }).then((response) => {
      console.log(response.body);
    });

    // acá tenemos que validar que minimo lleguen estas columnas - Name,Motus ID,Fuel Enabled,Company,Pre-note Validation,Driver Balance


  });
});
