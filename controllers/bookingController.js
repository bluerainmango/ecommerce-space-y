const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const catchAsync = require("../util/catchAsync");
const Booking = require("../models/bookingModel");
const User = require("../models/userModel");

const ErrorFactory = require("../util/ErrorFactory");

exports.getAllBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find();

  // console.log("🦁 bookings:", req.user, bookings);

  if (!bookings)
    return next(new ErrorFactory(404, "There is no existing bookings."));

  res.status(200).json({
    status: "success",
    result: bookings.length,
    data: bookings,
  });
});

exports.getOneBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.bookingId);

  // console.log("🦊 booking Id:", req.params.bookingId);

  if (!booking)
    return next(new ErrorFactory(404, "There is no existing booking."));

  res.status(200).json({
    status: "success",
    data: booking,
  });
});

// Get my bookings(populated)
exports.getMyBooking = catchAsync(async (req, res, next) => {
  //! user > booking(populate) > starship, planet(nested populate)
  const user = await User.findById(req.user._id)
    .populate({
      path: "booking",
      populate: { path: "starship" },
    })
    .populate({ path: "booking", populate: { path: "planet" } });

  const { booking } = user;

  // console.log("🐔 user, booking:", req.user, booking);
  // console.log("🐔 planet:", booking);

  if (!booking)
    return next(new ErrorFactory(404, "There is no existing booking."));

  res.status(200).json({
    status: "success",
    data: booking,
  });
});

exports.createBooking = catchAsync(async (req, res, next) => {
  const {
    planet,
    starship,
    user,
    departureDate,
    numOfPerson,
    price,
  } = req.query;

  // console.log("🥳 query:", req.query);

  const newBooking = await Booking.create({
    planet,
    starship,
    user,
    departureDate,
    numOfPerson,
    price,
  });

  res.status(200).json({
    status: "success",
    data: newBooking,
  });
});

exports.createCheckout = catchAsync(async (req, res, next) => {
  // console.log("🐰 req:", req.body.payload);
  // console.log("🐌 user before session:", req.user);

  const {
    planet,
    starship,
    totalPrice,
    numOfPerson,
    departureDate,
  } = req.body.payload;

  const url = `${req.protocol}://${req.get("host")}`;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: req.user.email,
    mode: "payment",
    metadata: {
      reservedDate: departureDate,
    },
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: planet.title,
            images: [
              `${req.protocol}://${req.get("host")}/${planet.collectionThumb}`,
            ],
          },
          unit_amount: planet.price * 100,
        },
        quantity: numOfPerson,
        description: `Departs on ${departureDate}`,
      },
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: starship.title,
            images: [
              `${req.protocol}://${req.get("host")}/${
                starship.collectionThumb
              }`,
            ],
          },
          unit_amount: starship.price * 100,
        },
        quantity: numOfPerson,
        description: `Departs on ${departureDate}`,
      },
    ],
    success_url: `${url}/checkout/success?planet=${planet._id}&starship=${starship._id}&user=${req.user._id}&price=${totalPrice}&departureDate=${departureDate}&numOfPerson=${numOfPerson}`,
    cancel_url: `${url}/?canceled=true`,
    // success_url: `${req.protocol}://${req.get("host")}/checkout/?planet=${
    //   planet._id
    // }&starship=${starship._id}&user=${
    //   req.user._id
    // }&price=${totalPrice}&success=true`,
    // cancel_url: `${req.protocol}://${req.get("host")}?canceled=true`,
  });

  // console.log("🐬 create checkout: req, session", req, session);

  res.status(200).json({
    status: "success",
    id: session.id,
    session: session,
  });
});

exports.deleteOneBooking = catchAsync(async (req, res, next) => {
  const { bookingId } = req.params;
  console.log("🐽 booking Id: ", bookingId);

  //* 1. remove one booking from all bookings
  const removedBooking = await Booking.findByIdAndRemove(bookingId);

  if (!removedBooking)
    return next(new ErrorFactory(404, "No coresponding booking is found."));

  console.log("🐷 removed booking: ", removedBooking);

  //* 2. remove one booking from user's booking list
  const user = await User.findById(req.user._id);

  user.booking.pull(bookingId);
  const updatedUser = await user.save({ validateBeforeSave: false });
  // const updatedBookingArr = user.booking.filter((el) => el._id !== bookingId);
  // user.booking = updatedBookingArr;

  console.log("🦧 user's booking list: ", updatedUser.booking);

  res.status(200).json({
    status: "success",
    message: "Successfully deleted booking.",
  });
});
