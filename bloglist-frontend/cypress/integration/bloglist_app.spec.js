describe("Bloglist app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3001/api/testing/reset");
    const user = {
      name: "Superuser",
      username: "root",
      password: "password",
    };
    cy.request("POST", "http://localhost:3001/api/users/", user);
    cy.visit("http://localhost:3000");
  });
  describe("Homepage", () => {
    it("Login form is shown", function () {
      cy.contains("Log into application");
      cy.contains("username");
      cy.contains("password");
    });
  });

  describe("login", function () {
    it("succeds with correct credentials", function () {
      cy.get("#username").type("root");
      cy.get("#password").type("password");
      cy.contains("log in").click();

      cy.contains("Superuser logged in");
    });

    it("fails with wrong credentials", function () {
      cy.get("#username").type("root");
      cy.get("#password").type("wrong");
      cy.contains("log in").click();

      cy.contains("wrong username or password");
      cy.get("html").should("not.contain", "Superuser logged in");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.get("#username").type("root");
      cy.get("#password").type("password");
      cy.contains("log in").click();
    });
    it("A blog can be created", function () {
      cy.contains("Create New Blog").click();

      cy.get("#title").type("How to conduct End2End testing with cypress");
      cy.get("#author").type("Oghenemarho Orukele");
      cy.get("#url").type("http://oghenemarho-orukele.com");
      cy.get("#create").click();

      cy.get("html").should(
        "contain",
        "a new blog How to conduct End2End testing with cypress by Oghenemarho Orukele added"
      );
    });

    it("user can like a blog", function () {
      cy.contains("Create New Blog").click();

      cy.get("#title").type("How to conduct End2End testing with cypress");
      cy.get("#author").type("Oghenemarho Orukele");
      cy.get("#url").type("http://oghenemarho-orukele.com");
      cy.get("#create").click();

      cy.contains("view").click();
      cy.get("#like").click();

      cy.get("html").should("contain", "likes 1");
    });

    it("user can delete a blog", function () {
      cy.contains("Create New Blog").click();

      cy.get("#title").type("How to conduct End2End testing with cypress");
      cy.get("#author").type("Oghenemarho Orukele");
      cy.get("#url").type("http://oghenemarho-orukele.com");
      cy.get("#create").click();

      cy.contains("view").click();
      cy.get("#remove").click();

      cy.get("html").should(
        "not.contain",
        "How to conduct End2End testing with cypress"
      );
    });
  });

  describe("Sorting Blogs", function () {
    beforeEach(function () {
      cy.login({ username: "root", password: "password" });
      cy.createBlog({
        title: "How to conduct End2End testing with cypress",
        author: "Oghenemarho Orukele",
        url: "http://oghenemarho-orukele.com",
        likes: 15,
      });
      cy.createBlog({
        title: "This blog should not be sorted to the top",
        author: "Oghenemarho Orukele",
        url: "http://oghenemarho-orukele.com",
        likes: 15,
      });

      cy.get("#username").type("root");
      cy.get("#password").type("password");
      cy.contains("log in").click();
    });
    it("sort blogs based on likes", function () {
      cy.get("#bloglist")
        .children()
        .first()
        .contains("view")
        .click()
        .get("#like")
        .click()
        .wait(500);
      cy.get("#bloglist")
        .children()
        .first()
        .should("contain.text", "How to conduct End2End testing with cypress");
      cy.get("#bloglist")
        .children()
        .last()
        .should("contain.text", "This blog should not be sorted to the top")
        .should(
          "not.contain.text",
          "How to conduct End2End testing with cypress"
        );
    });
  });
});
