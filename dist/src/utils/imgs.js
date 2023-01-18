"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommunityImg = exports.getBannerImg = exports.getProfileImg = exports.imgs = void 0;
const IMG1 = process.env.IMG_1;
const IMG2 = process.env.IMG_2;
const IMG3 = process.env.IMG_3;
const IMG4 = process.env.IMG_4;
const IMG5 = process.env.IMG_5;
const IMG6 = process.env.IMG_6;
const IMG7 = process.env.IMG_7;
const IMG8 = process.env.IMG_8;
const BANNER1 = process.env.BANNER_1;
const BANNER2 = process.env.BANNER_2;
const BANNER3 = process.env.BANNER_3;
const BANNER4 = process.env.BANNER_4;
const BANNER5 = process.env.BANNER_5;
const BANNER6 = process.env.BANNER_6;
const BANNER7 = process.env.BANNER_7;
const BANNER8 = process.env.BANNER_8;
const BANNER9 = process.env.BANNER_9;
const BANNER10 = process.env.BANNER_10;
const comm1 = process.env.COMM_1;
const comm2 = process.env.COMM_2;
const comm3 = process.env.COMM_3;
const comm4 = process.env.COMM_4;
const comm5 = process.env.COMM_5;
const comm6 = process.env.COMM_6;
const comm7 = process.env.COMM_7;
const comm8 = process.env.COMM_8;
const comm9 = process.env.COMM_9;
const comm10 = process.env.COMM_10;
const comm11 = process.env.COMM_11;
const comm12 = process.env.COMM_12;
exports.imgs = [IMG1, IMG2, IMG3, IMG4, IMG5, IMG6, IMG7, IMG8];
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
const getProfileImg = () => {
    const randomNumber = Math.floor(Math.random() * exports.imgs.length);
    return exports.imgs[randomNumber];
};
exports.getProfileImg = getProfileImg;
const getBannerImg = () => banners[Math.floor(Math.random() * banners.length)];
exports.getBannerImg = getBannerImg;
const getCommunityImg = () => community_imgs[Math.floor(Math.random() * community_imgs.length)];
exports.getCommunityImg = getCommunityImg;
//# sourceMappingURL=imgs.js.map