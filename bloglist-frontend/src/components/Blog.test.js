import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import Blog from "./Blog";
import BlogForm from "./BlogForm";

describe("Blog list test", () => {
  let component;
  const blog = {
    title: "A blog on how to test react components",
    author: "Super user",
    url: "www.superuser.com",
    likes: 12,
  };

  const mockHandleLike = jest.fn();
  const mockHandleDelete = jest.fn();

  beforeEach(() => {
    component = render(
      <Blog
        blog={blog}
        handleLikes={mockHandleLike}
        handleDelete={mockHandleDelete}
      />
    );
  });

  test("should render only blog tittle", () => {
    const div = component.container.querySelector(".togglePart");

    expect(div).toHaveStyle("display: none");

    expect(component.container).toHaveTextContent(
      "A blog on how to test react components"
    );
  });

  test("should render blog url and likes when show button is clicked", () => {
    const button = component.getByText("view");
    fireEvent.click(button);

    const div = component.container.querySelector(".togglePart");
    const likes = div.querySelector(".likes");
    const url = div.querySelector(".url");

    expect(div).not.toHaveStyle("display: none");
    expect(likes).toHaveTextContent("likes 12");
    expect(url).toHaveTextContent("www.superuser.com");
  });

  test("should call event handler twice when like button is clicked twice", () => {
    const button = component.getByText("like");
    fireEvent.click(button);
    fireEvent.click(button);

    expect(mockHandleLike.mock.calls).toHaveLength(2);
  });

  test("should recieve proper information when creating a new blog", () => {
    const createBlog = jest.fn();

    const formComponent = render(<BlogForm handleCreate={createBlog} />);

    const title = formComponent.container.querySelector("#title");
    const author = formComponent.container.querySelector("#author");
    const url = formComponent.container.querySelector("#url");
    const form = formComponent.container.querySelector("form");

    const newBlog = {
      title: "Sleek Granite Bacon and fries",
      author: "Annie Bolade Oyin",
      url: "www.theirdaddies.com",
    };

    fireEvent.change(title, {
      target: { value: newBlog.title },
    });

    fireEvent.change(author, {
      target: { value: newBlog.author },
    });

    fireEvent.change(url, {
      target: { value: newBlog.url },
    });

    fireEvent.submit(form);
    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0]).toMatchObject(newBlog);
  });
});
