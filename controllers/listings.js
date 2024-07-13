const Listing = require("../models/listing.js");
const axios = require("axios");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    res.redirect("/listings");
  }
  //console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(url, "..", filename);
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  // console.log(newListing.location);
  const address = newListing.location;
  let key = process.env.MAP_API;
  const response = await axios.get(
    `https://geocode.maps.co/search?q=${address}&api_key=${key}`
  );
  console.log("latitude:", response.data[0].lat);
  console.log("longitude:", response.data[0].lon);
  newListing.geometry.coordinates[0] = response.data[0].lat;
  newListing.geometry.coordinates[1] = response.data[0].lon;
  await newListing.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  const address = req.body.listing.location;
  // console.log(req.body.listing.location);
  let key = process.env.MAP_API;
  const response = await axios.get(
    `https://geocode.maps.co/search?q=${address}&api_key=${key}`
  );
  console.log("latitude:", response.data[0].lat);
  console.log("longitude:", response.data[0].lon);
  listing.geometry.coordinates[0] = response.data[0].lat;
  listing.geometry.coordinates[1] = response.data[0].lon;
  await listing.save();

  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};

module.exports.search = async (req, res) => {
  let search = req.query.search;
  console.log(search);
  search = search.toLowerCase();
  let allListings = await Listing.find({ category: search });
  if (allListings.length === 0) {
    req.flash("error", "No such results found!");
    return res.redirect("/listings");
  }
  res.render("listings/index.ejs", { allListings });
};

module.exports.filter = async (req, res) => {
  let { category } = req.params;
  console.log(category);
  category = category.toLowerCase();
  let allListings = await Listing.find({ category: category });
  if (allListings.length === 0) {
    req.flash("error", "No such results found!");
    return res.redirect("/listings");
  }
  res.render("listings/index.ejs", { allListings });
};
