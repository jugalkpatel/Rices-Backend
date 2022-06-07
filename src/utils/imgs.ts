const IMG1 = process.env.IMG_1 as string;
const IMG2 = process.env.IMG_2 as string;
const IMG3 = process.env.IMG_3 as string;
const IMG4 = process.env.IMG_4 as string;
const IMG5 = process.env.IMG_5 as string;
const IMG6 = process.env.IMG_6 as string;
const IMG7 = process.env.IMG_7 as string;
const IMG8 = process.env.IMG_8 as string;

const BANNER1 = process.env.BANNER_1 as string;
const BANNER2 = process.env.BANNER_2 as string;
const BANNER3 = process.env.BANNER_3 as string;
const BANNER4 = process.env.BANNER_4 as string;
const BANNER5 = process.env.BANNER_5 as string;
const BANNER6 = process.env.BANNER_6 as string;
const BANNER7 = process.env.BANNER_7 as string;
const BANNER8 = process.env.BANNER_8 as string;
const BANNER9 = process.env.BANNER_9 as string;
const BANNER10 = process.env.BANNER_10 as string;

const comm1 = process.env.COMM_1 as string;
const comm2 = process.env.COMM_2 as string;
const comm3 = process.env.COMM_3 as string;
const comm4 = process.env.COMM_4 as string;
const comm5 = process.env.COMM_5 as string;
const comm6 = process.env.COMM_6 as string;
const comm7 = process.env.COMM_7 as string;
const comm8 = process.env.COMM_8 as string;
const comm9 = process.env.COMM_9 as string;
const comm10 = process.env.COMM_10 as string;
const comm11 = process.env.COMM_11 as string;
const comm12 = process.env.COMM_12 as string;

export const imgs = [IMG1, IMG2, IMG3, IMG4, IMG5, IMG6, IMG7, IMG8];
const banners = [
  BANNER1,
  BANNER2,
  BANNER3,
  BANNER4,
  BANNER5,
  BANNER6,
  BANNER7,
  BANNER8,
  BANNER9,
  BANNER10,
];
const community_imgs = [
  comm1,
  comm2,
  comm3,
  comm4,
  comm5,
  comm6,
  comm7,
  comm8,
  comm9,
  comm10,
  comm11,
  comm12,
];

export const getProfileImg = () => {
  const randomNumber = Math.floor(Math.random() * imgs.length);

  return imgs[randomNumber];
};

export const getBannerImg = () =>
  banners[Math.floor(Math.random() * banners.length)];

export const getCommunityImg = () =>
  community_imgs[Math.floor(Math.random() * community_imgs.length)];
