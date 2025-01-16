/**
 * Lots of this code modified from a version originally written by Hoishin.
 */

type Coor = [number, number];
type BoxCoor = [Coor, Coor, Coor, Coor];

function sortBoxCoor(boxCoor: BoxCoor) {
  boxCoor.sort((a, b) => (a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]));
  return [boxCoor[0], boxCoor[1], boxCoor[3], boxCoor[2], boxCoor[0]];
}

function makeCoors(width: number, height: number, boxCoors: Coor[][]) {
  boxCoors.sort((a, b) => (a[0][0]) - (b[0][0]));
  const res = boxCoors.reduce<Coor[]>((prev, boxCoor) => {
    const entry: Coor = [boxCoor[0][0], 0];
    prev.push(entry, ...boxCoor, entry);
    return prev;
  }, [[0, 0]]);
  res.push([width, 0], [width, height], [0, height], [0, 0]);
  return res;
}

function outputCss(coors: Coor[]) {
  const polygon = coors
    .map((coor) => coor.map((n) => `${n}px`).join(' '))
    .join(', ');
  const css = `polygon(${polygon})`;
  return css;
}

export function generateClipPath(): string {
  const captureElems = document.getElementsByClassName('Capture');
  const coordsArr = Array.from(captureElems).map((el) => {
    const sizes = el.getBoundingClientRect();
    const coords: BoxCoor = [
      [sizes.x, sizes.y],
      [sizes.right, sizes.y],
      [sizes.x, sizes.bottom],
      [sizes.right, sizes.bottom],
    ];
    return sortBoxCoor(coords);
  });
  return outputCss(makeCoors(
    1920, // width
    1080, // height
    coordsArr,
  ));
}
