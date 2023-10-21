const scriptLoader = (host, callback) => {
  const metypeScript = document.createElement("script");
  metypeScript.setAttribute("src", `https://www.metype.com/quintype-metype/assets/metype.js`);
  metypeScript.setAttribute("data-metype-script", "1");
  metypeScript.async = 1;
  metypeScript.onload = () => callback();
  document.body.appendChild(metypeScript);
};

export { scriptLoader };
