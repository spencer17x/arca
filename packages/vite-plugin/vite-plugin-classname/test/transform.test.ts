import { transformCSS, transformTSX } from '../src/transform';

describe('transform', function () {
  it('transform css', function () {
    const code = `.app .h1 {
      color: red;
    }
    .app .h2 {
      color: blue;
    }
    .app .h3 {
      color: green;
    }`;
    expect(transformCSS('dd', code)).toMatchInlineSnapshot(`".dd-app .dd-h1{color:red}.dd-app .dd-h2{color:blue}.dd-app .dd-h3{color:green}"`);
  });

  it('transformTSX', function () {
    const oneClassNameCode = `{
      className: "app",
      children: []
    }`;
    const multipleClassNameCode = `{
      className: "app",
      children: [
        {
          className: "h1",
          children: []
        },
        {
          className: "h2",
          children: []
        }
      ]
    }`;
    expect(transformTSX('dd', oneClassNameCode)).toMatchInlineSnapshot(`
"{
      className: \\"dd-app\\",
      children: []
    }"
`);
    expect(transformTSX('dd', multipleClassNameCode)).toMatchInlineSnapshot(`
"{
      className: \\"dd-app\\",
      children: [
        {
          className: \\"dd-h1\\",
          children: []
        },
        {
          className: \\"dd-h2\\",
          children: []
        }
      ]
    }"
`);
  });
});
