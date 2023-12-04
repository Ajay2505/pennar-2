const map = () => {
  document.querySelector(".map_input").addEventListener("focus", (evt) => {
    evt.target.parentElement.classList.add("focus");
    evt.target.nextElementSibling.classList.add("rotate");
    document.querySelector(".list_div").classList.add("show");
    // document.querySelector(".map_content").classList.add("hide");
    // setTimeout(() => {
    //     document.querySelector(".map_content").classList.remove("active");
    // }, 200);
  });

  document.querySelector(".map_input").addEventListener("blur", (evt) => {
    evt.target.parentElement.classList.remove("focus");
    evt.target.nextElementSibling.classList.remove("rotate");
    document.querySelector(".list_div").classList.remove("show");
    if (evt.target.value.length < 1) {
      // document.querySelector(".map_content").classList.remove("active");
    } else {
      document.querySelector(".list_div button.focus")?.click();
      const event = new Event("input", { bubbles: true });
      document.querySelector(".map_input").dispatchEvent(event);
      // document.querySelector(".map_content").classList.add("active");
    }
  });

  let focusIndex = 0;

  document.querySelector(".map_input").addEventListener("input", (evt) => {
    const value = evt.target.value;
    focusIndex = 0;
    if (value.length > 0) {
      document.querySelector(".x_mark").classList.add("show");
      document.querySelector(".map_icon").classList.add("hide");
    } else {
      document.querySelector(".x_mark").classList.remove("show");
      document.querySelector(".map_icon").classList.remove("hide");
      setAllColors();
    }
    const languages = document.querySelectorAll(".list_div button");
    languages.forEach((lang, idx) => {
      if (
        lang?.innerText.toLocaleLowerCase().match(value.toLocaleLowerCase())
      ) {
        document
          .querySelectorAll(".list_div button")
          [idx].classList.remove("hide");
      } else {
        document
          .querySelectorAll(".list_div button")
          [idx].classList.add("hide");
      }
      document
        .querySelectorAll(".list_div button")
        [idx].classList.remove("focus");
      document
        .querySelector(".list_div button:not(.hide)")
        ?.classList.add("focus");
    });
  });

  document.querySelector(".map_input").addEventListener("keydown", (evt) => {
    if (evt.key === "Enter") {
      document.querySelector(".list_div button.focus")?.click();
      evt.target.blur();
    } else if (evt.key === "ArrowUp") {
      if (focusIndex <= 0) {
        return;
      } else {
        document
          .querySelectorAll(".list_div button:not(.hide)")
          [focusIndex].classList.remove("focus");
        focusIndex--;
        document
          .querySelectorAll(".list_div button:not(.hide)")
          [focusIndex].classList.add("focus");
      }
    } else if (evt.key === "ArrowDown") {
      if (
        !(
          focusIndex + 2 >
          document.querySelectorAll(".list_div button:not(.hide)")?.length
        )
      ) {
        document
          .querySelectorAll(".list_div button:not(.hide)")
          [focusIndex].classList.remove("focus");
        focusIndex++;
        document
          .querySelectorAll(".list_div button:not(.hide)")
          [focusIndex].classList.add("focus");
      }
    }
  });

  document.querySelector(".x_mark").addEventListener("click", () => {
    document.querySelector(".map_input").value = "";
    const event = new Event("input", { bubbles: true });
    document.querySelector(".map_input").dispatchEvent(event);
    // document.querySelector(".map_content").classList.remove("active");
    setTimeout(() => {
      document.querySelector(".map_input").focus();
    }, 350);
  });
};
map();
function langBtn(evt) {
  document.querySelector(".map_input").value = evt.target.innerText;
  const event = new Event("input", { bubbles: true });
  document.querySelector(".map_input").dispatchEvent(event);
  // document.querySelector(".map_content").classList.add("active");
  // const content =  document.querySelector(".map_content.content");
  // const allContent = content.querySelectorAll("[data-lang]");
  // allContent.forEach(c => {
  //     c.classList.add("d-none");
  // });
  // content.querySelector(`[data-lang="${evt.target.innerText}"]`).classList.remove("d-none");

  const svg = document.getElementById("map_svg");
  const pathID = evt.target.getAttribute("data-map-pathID");
  const targetPath = document.getElementById(pathID);
  resetColors();
  const targetBBox = targetPath?.getBBox();

  const isLargeScreen = window.innerWidth >= 1024; // Adjust the breakpoint as needed
  const viewBoxX = isLargeScreen ? targetBBox.x - 40 : targetBBox.x;
  const viewBoxY = targetBBox.y;
  const viewBoxWidth = targetBBox.width;
  const viewBoxHeight = targetBBox.height;

  targetPath.setAttribute("fill", "#253d97");
  gsap.to(svg, {
    duration: 0.5,
    attr: {
      viewBox: `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`,
    },
    ease: "power2.out",
  });
}

function resetColors() {
  const paths = document.querySelectorAll("[data-map-pathID]");
  paths.forEach((path) => {
    document
      .getElementById(path?.getAttribute("data-map-pathID"))
      ?.setAttribute("fill", "currentColor");
  });
}

function setMap() {
  const svg = document.getElementById("map_svg");
  const paths = document.querySelectorAll("[data-map-pathID]");
  const pathIDs = [];

  paths.forEach((path) => {
    const pathID = path.getAttribute("data-map-pathID");
    pathIDs.push(pathID);
  });

  // Calculate the collective bounding box that encompasses all specified paths
  const combinedBBox = pathIDs.reduce(
    (bbox, pathID) => {
      const pathElement = document.getElementById(pathID);
      if (pathElement) {
        const pathBBox = pathElement.getBBox();
        bbox.x = Math.min(bbox.x, pathBBox.x);
        bbox.y = Math.min(bbox.y, pathBBox.y);
        bbox.width = Math.max(bbox.width, pathBBox.x + pathBBox.width);
        bbox.height = Math.max(bbox.height, pathBBox.y + pathBBox.height);
      }
      return bbox;
    },
    { x: Infinity, y: Infinity, width: -Infinity, height: -Infinity }
  );

  // Calculate new viewBox values
  const viewBoxX = combinedBBox.x;
  const viewBoxY = combinedBBox.y;
  const viewBoxWidth = combinedBBox.width - combinedBBox.x;
  const viewBoxHeight = combinedBBox.height - combinedBBox.y;

  // Set the new viewBox on the SVG
  gsap.to(svg, {
    duration: 0.5,
    attr: {
      viewBox: `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`,
    },
    ease: "power2.out",
  });
  setAllColors();
}
setMap();

function setAllColors() {
  const paths = document.querySelectorAll("[data-map-pathID]");

  paths.forEach((path) => {
    const pathElement = document.getElementById(
      path?.getAttribute("data-map-pathID")
    );
    if (pathElement) {
      pathElement?.setAttribute("fill", "#253d97");
    }
  });
}
