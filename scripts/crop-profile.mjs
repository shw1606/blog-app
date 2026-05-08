import sharp from "sharp";

const INPUT = "/Users/hyunwoo/Downloads/IMG_4247.jpg";
const OUTPUT = "/Users/hyunwoo/Projects/blog-app/public/profile.jpg";

// Crop region for shoulders+chest framing.
// Original is 1940x2587; face center near (938, 970), hair top y≈810,
// mid-chest y≈1720. 4:5 with face at ~30% from top.
const CROP = { left: 538, top: 720, width: 800, height: 1000 };

const meta = await sharp(INPUT).metadata();
console.log(`Source: ${meta.width}x${meta.height}`);
console.log(`Crop:   left=${CROP.left} top=${CROP.top} ${CROP.width}x${CROP.height}`);

await sharp(INPUT)
  .extract(CROP)
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(OUTPUT);

const out = await sharp(OUTPUT).metadata();
console.log(`Output: ${OUTPUT} (${out.width}x${out.height})`);
