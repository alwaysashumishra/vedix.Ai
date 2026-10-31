import React, { useState, useMemo } from "react";
import {
  FaBus,
  FaTrainSubway,
  FaPlane,
  FaCar,
  FaRepeat,
  FaCalendarDays,
  FaUser,
  FaLocationDot,
  FaStar,
  FaArrowRight,
  FaIndianRupeeSign,
  FaShieldHalved,
  FaClock,
  FaTableCellsLarge,
  FaWifi,
  FaPlug,
  FaBottleWater,
  FaUtensils,
  FaVideo,
  FaLightbulb,
  FaBed,
  FaWind,
  FaHeart,
  FaRegHeart,
  FaChevronDown,
  FaChevronUp,
  FaArrowLeft,
  FaMagnifyingGlass,
  FaCircleCheck,
  FaBolt,
  FaTag,
  FaSuitcaseRolling,
  FaSuitcase,
  FaChair,
  FaGasPump,
  FaSnowflake,
  FaEllipsisVertical,
  FaRoad,
} from "react-icons/fa6";

import busHeaderBgImg from "../../assets/bus_results_header_bg.jpg";
import trainHeaderBgImg from "../../assets/train_results_header_bg.jpg";
import flightHeaderBgImg from "../../assets/flight_results_header_clean_bg.jpg";
import cabHeaderBgImg from "../../assets/cab_results_header_clean_bg.jpg";
import cabMapCanvasImg from "../../assets/cab_map_canvas.png";

import thumbZingbus from "../../assets/thumb_zingbus.jpg";
import thumbIntrcity from "../../assets/thumb_intrcity.jpg";
import thumbSrs from "../../assets/thumb_srs.jpg";
import thumbRsyadav from "../../assets/thumb_rsyadav.jpg";
import thumbNeeta from "../../assets/thumb_neeta.jpg";

import thumbVandeBharat from "../../assets/thumb_train_vandebharat.jpg";
import thumbRajdhani from "../../assets/thumb_train_rajdhani.jpg";
import thumbAugustKranti from "../../assets/thumb_train_augustkranti.jpg";
import thumbHowrah from "../../assets/thumb_train_howrah.jpg";

import thumbIndigo from "../../assets/thumb_airline_indigo.png";
import thumbAirIndia from "../../assets/thumb_airline_airindia.png";
import thumbVistara from "../../assets/thumb_airline_vistara.png";
import thumbAkasa from "../../assets/thumb_airline_akasa.png";
import thumbSpicejet from "../../assets/thumb_airline_spicejet.png";

import thumbCabHatchback from "../../assets/thumb_cab_hatchback.png";
import thumbCabSedan from "../../assets/thumb_cab_sedan.png";
import thumbCabSuv from "../../assets/thumb_cab_suv.png";
import thumbCabPremiumSuv from "../../assets/thumb_cab_premiumsuv.png";
import thumbCabElectric from "../../assets/thumb_cab_electric.png";
import thumbCabLuxury from "../../assets/thumb_cab_luxury.png";

import {
  generateRealFlights,
  generateRealTrains,
  generateRealBuses,
  generateRealCabs,
  findCity,
  calculateDistance,
  getHighwayRoute,
} from "./realTravelDataEngine.js";

import PlaceAutocomplete from "./PlaceAutocomplete";
import TravelDatePicker from "./TravelDatePicker";

const AMENITY_ICONS = {
  WiFi: { icon: FaWifi, label: "WiFi" },
  Charging: { icon: FaPlug, label: "Charging" },
  "Charging Port": { icon: FaPlug, label: "Charging" },
  "Onboard Catering": { icon: FaUtensils, label: "Catering" },
  "Clean Toilets": { icon: FaShieldHalved, label: "Clean Toilets" },
  "Bio Toilet": { icon: FaShieldHalved, label: "Bio Toilet" },
  "Bed Roll": { icon: FaBed, label: "Bed Roll" },
  Blanket: { icon: FaBed, label: "Blanket" },
  "Blanket & Pillow": { icon: FaBed, label: "Blanket & Pillow" },
  "Water Bottle": { icon: FaBottleWater, label: "Water Bottle" },
  "Reading Light": { icon: FaLightbulb, label: "Reading Light" },
  Snacks: { icon: FaUtensils, label: "Snacks" },
  "GPS Tracking": { icon: FaLocationDot, label: "GPS Tracking" },
  CCTV: { icon: FaVideo, label: "CCTV" },
  AC: { icon: FaWind, label: "A/C" },
  "Non-AC": { icon: FaWind, label: "Non-AC" },
};

const FLIGHT_AIRLINES_METADATA = [
  { name: "IndiGo", count: 78 },
  { name: "Air India", count: 62 },
  { name: "Vistara", count: 48 },
  { name: "Akasa Air", count: 38 },
  { name: "SpiceJet", count: 36 },
  { name: "Air India Express", count: 32 },
  { name: "Go First", count: 28 },
  { name: "Others", count: 20 },
];

const FLIGHT_STOPS_METADATA = [
  { label: "Non-stop", count: 86 },
  { label: "1 Stop", count: 124 },
  { label: "2+ Stops", count: 32 },
];

const CAB_VEHICLE_TYPES = [
  { label: "Hatchback", count: 52 },
  { label: "Sedan", count: 86 },
  { label: "SUV", count: 74 },
  { label: "Luxury", count: 28 },
  { label: "Electric", count: 12 },
];

const CAB_FUEL_TYPES = [
  { label: "Petrol", count: 136 },
  { label: "Diesel", count: 58 },
  { label: "Electric", count: 12 },
];

const CAB_CAPACITY_OPTIONS = [
  { label: "4 Seater", count: 78 },
  { label: "6 Seater", count: 42 },
  { label: "7 Seater", count: 38 },
  { label: "8+ Seater", count: 14 },
];

const CAB_OPERATOR_LIST = [
  { name: "Ola", count: 82 },
  { name: "Uber", count: 76 },
  { name: "Rapido", count: 34 },
  { name: "BluSmart", count: 18 },
  { name: "Meru", count: 12 },
  { name: "Savaari", count: 10 },
  { name: "Others", count: 16 },
];

const TransportResultsPage = ({
  searchParams,
  selectedMode = "cab",
  onSelectMode,
  onBackToSearch,
  onUpdateParams,
  onReSearch,
  onSelectBooking,
}) => {
  const isTrain = selectedMode === "train";
  const isFlight = selectedMode === "flight";
  const isBus = selectedMode === "bus";
  const isCab = selectedMode === "cab";

  // Context-aware defaults based on mode
  const origin =
    searchParams?.origin ||
    (isCab
      ? "New Delhi"
      : isFlight
      ? "New Delhi (DEL)"
      : isTrain
      ? "New Delhi (NDLS)"
      : "Delhi (All Locations)");
  const destination =
    searchParams?.destination ||
    (isCab
      ? "Gurugram, Haryana"
      : isFlight
      ? "Bengaluru (BLR)"
      : isTrain
      ? "Mumbai Central (MMCT)"
      : "Lucknow (All Locations)");
  const passengers = Number(searchParams?.passengers) || (isCab ? 4 : 1);

  // Format Date
  const formattedDate = useMemo(() => {
    if (!searchParams?.departureDate) {
      return isCab ? "Sat, 15 Nov 2025, 10:00 AM" : "Sat, 15 Nov 2025";
    }
    try {
      const d = new Date(searchParams.departureDate);
      if (isNaN(d.getTime())) return searchParams.departureDate;
      const baseStr = d.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      return isCab ? `${baseStr}, 10:00 AM` : baseStr;
    } catch {
      return searchParams.departureDate;
    }
  }, [searchParams?.departureDate, isCab]);

  // Real Dynamic Calculations for Current Route
  const routeMetrics = useMemo(() => {
    const cA = findCity(origin);
    const cB = findCity(destination);
    return calculateDistance(cA, cB);
  }, [origin, destination]);

  const highwayName = useMemo(() => {
    const cA = findCity(origin);
    const cB = findCity(destination);
    return getHighwayRoute(cA, cB);
  }, [origin, destination]);

  // Real Dynamic Data Inventories
  const generatedRealFlights = useMemo(() => {
    return generateRealFlights(origin, destination, passengers, {
      thumbIndigo,
      thumbAirIndia,
      thumbVistara,
      thumbAkasa,
      thumbSpicejet,
    });
  }, [origin, destination, passengers]);

  const generatedRealTrains = useMemo(() => {
    return generateRealTrains(origin, destination, passengers, {
      thumbVandeBharat,
      thumbRajdhani,
      thumbAugustKranti,
      thumbHowrah,
    });
  }, [origin, destination, passengers]);

  const generatedRealBuses = useMemo(() => {
    return generateRealBuses(origin, destination, passengers, {
      thumbZingbus,
      thumbIntrcity,
      thumbSrs,
      thumbRsyadav,
      thumbNeeta,
    });
  }, [origin, destination, passengers]);

  const generatedRealCabs = useMemo(() => {
    return generateRealCabs(origin, destination, passengers, {
      thumbCabHatchback,
      thumbCabSedan,
      thumbCabSuv,
      thumbCabPremiumSuv,
      thumbCabElectric,
      thumbCabLuxury,
    });
  }, [origin, destination, passengers]);

  // Filters State
  const [maxPrice, setMaxPrice] = useState(isTrain ? 5000 : 3000);
  const [flightMaxPrice, setFlightMaxPrice] = useState(50000);
  const [cabMaxPrice, setCabMaxPrice] = useState(15000);

  const [selectedQuota, setSelectedQuota] = useState([]);
  const [selectedClass, setSelectedClass] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [selectedTrainTypes, setSelectedTrainTypes] = useState([]);

  // Flight specific filters
  const [selectedStops, setSelectedStops] = useState([]);
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [airlineSearch, setAirlineSearch] = useState("");
  const [selectedTripType, setSelectedTripType] = useState("oneway");
  const [expandedFlightId, setExpandedFlightId] = useState(null);

  // Cab specific filters
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState([]);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState([]);
  const [selectedCapacities, setSelectedCapacities] = useState([]);
  const [selectedCabOperators, setSelectedCabOperators] = useState([]);
  const [cabOperatorSearch, setCabOperatorSearch] = useState("");
  const [cabTripType, setCabTripType] = useState("oneway");

  // Bus specific filters
  const [selectedBusTypes, setSelectedBusTypes] = useState([]);
  const [selectedSeating, setSelectedSeating] = useState([]);
  const [selectedOperators, setSelectedOperators] = useState([]);
  const [selectedBusPlatforms, setSelectedBusPlatforms] = useState([]);
  const [operatorSearch, setOperatorSearch] = useState("");

  const [sortBy, setSortBy] = useState("recommended");
  const [favorites, setFavorites] = useState({});
  const [passengerDropdownOpen, setPassengerDropdownOpen] = useState(false);

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleClearAll = () => {
    setMaxPrice(isTrain ? 5000 : 3000);
    setFlightMaxPrice(50000);
    setCabMaxPrice(15000);
    setSelectedQuota([]);
    setSelectedClass([]);
    setSelectedTimes([]);
    setSelectedTrainTypes([]);
    setSelectedBusTypes([]);
    setSelectedSeating([]);
    setSelectedOperators([]);
    setSelectedBusPlatforms([]);
    setSelectedStops([]);
    setSelectedAirlines([]);
    setSelectedVehicleTypes([]);
    setSelectedFuelTypes([]);
    setSelectedCapacities([]);
    setSelectedCabOperators([]);
    setOperatorSearch("");
    setAirlineSearch("");
    setCabOperatorSearch("");
  };

  const toggleListFilter = (list, setList, item) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  // Filtered Cabs List
  const filteredCabs = useMemo(() => {
    return generatedRealCabs
      .filter((cab) => {
        const lowestPrice = Math.min(...cab.platforms.map((p) => p.price));
        if (lowestPrice > cabMaxPrice) return false;

        if (
          selectedVehicleTypes.length > 0 &&
          !selectedVehicleTypes.some(
            (vt) =>
              cab.name.toLowerCase().includes(vt.toLowerCase()) ||
              cab.category.toLowerCase().includes(vt.toLowerCase())
          )
        ) {
          return false;
        }

        if (selectedFuelTypes.length > 0 && !selectedFuelTypes.includes(cab.fuel)) {
          return false;
        }

        if (selectedCapacities.length > 0) {
          const matchesCap = selectedCapacities.some((sc) => {
            const capNum = parseInt(sc, 10);
            if (sc.includes("8+")) return cab.capacity >= 8;
            return cab.capacity === capNum;
          });
          if (!matchesCap) return false;
        }

        if (selectedCabOperators.length > 0) {
          const hasOp = selectedCabOperators.some((op) =>
            cab.platforms.some((p) => p.name.toLowerCase().includes(op.toLowerCase()))
          );
          if (!hasOp) return false;
        }

        if (cabOperatorSearch.trim()) {
          const q = cabOperatorSearch.toLowerCase().trim();
          const hasOp = cab.platforms.some((p) => p.name.toLowerCase().includes(q));
          if (!hasOp) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const aLowest = Math.min(...a.platforms.map((p) => p.price));
        const bLowest = Math.min(...b.platforms.map((p) => p.price));
        if (sortBy === "priceLow") return aLowest - bLowest;
        if (sortBy === "priceHigh") return bLowest - aLowest;
        if (sortBy === "fastest") return a.etaMins - b.etaMins;
        return 0;
      });
  }, [
    generatedRealCabs,
    cabMaxPrice,
    selectedVehicleTypes,
    selectedFuelTypes,
    selectedCapacities,
    selectedCabOperators,
    cabOperatorSearch,
    sortBy,
  ]);

  // Filtered Flights List
  const filteredFlights = useMemo(() => {
    return generatedRealFlights
      .filter((fl) => {
        if (fl.price > flightMaxPrice) return false;

        if (selectedStops.length > 0 && !selectedStops.includes(fl.stops)) {
          return false;
        }

        if (selectedTimes.length > 0 && !selectedTimes.includes(fl.departureTimeOfDay)) {
          return false;
        }

        if (selectedAirlines.length > 0 && !selectedAirlines.includes(fl.airlineName)) {
          return false;
        }

        if (airlineSearch.trim()) {
          const q = airlineSearch.toLowerCase().trim();
          const matchesName = fl.airlineName.toLowerCase().includes(q);
          const matchesNum = fl.flightNumber.toLowerCase().includes(q);
          if (!matchesName && !matchesNum) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "priceLow") return a.price - b.price;
        if (sortBy === "priceHigh") return b.price - a.price;
        if (sortBy === "fastest") return a.durationMins - b.durationMins;
        return 0;
      });
  }, [generatedRealFlights, flightMaxPrice, selectedStops, selectedTimes, selectedAirlines, airlineSearch, sortBy]);

  // Filtered Train List
  const filteredTrains = useMemo(() => {
    return generatedRealTrains
      .filter((tr) => {
        const lowestPrice = Math.min(...tr.platforms.map((p) => p.price));
        if (lowestPrice > maxPrice) return false;

        if (selectedTimes.length > 0 && !selectedTimes.includes(tr.departureTimeOfDay)) {
          return false;
        }

        if (selectedTrainTypes.length > 0 && !selectedTrainTypes.includes(tr.type)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const aLowest = Math.min(...a.platforms.map((p) => p.price));
        const bLowest = Math.min(...b.platforms.map((p) => p.price));
        if (sortBy === "priceLow") return aLowest - bLowest;
        if (sortBy === "priceHigh") return bLowest - aLowest;
        if (sortBy === "fastest") return a.durationMins - b.durationMins;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0;
      });
  }, [generatedRealTrains, maxPrice, selectedTimes, selectedTrainTypes, sortBy]);

  // Filtered Bus List
  const filteredBuses = useMemo(() => {
    return generatedRealBuses
      .filter((bus) => {
        const lowestPrice = Math.min(...bus.platforms.map((p) => p.price));
        if (lowestPrice > maxPrice) return false;

        if (selectedBusTypes.length > 0 && !selectedBusTypes.includes(bus.busType)) {
          return false;
        }
        if (selectedSeating.length > 0 && !selectedSeating.includes(bus.seatingType)) {
          return false;
        }
        if (selectedTimes.length > 0 && !selectedTimes.includes(bus.departureTimeOfDay)) {
          return false;
        }
        if (selectedOperators.length > 0) {
          const matchesOp = selectedOperators.some((op) =>
            bus.operator.toLowerCase().includes(op.toLowerCase())
          );
          if (!matchesOp) return false;
        }
        if (selectedBusPlatforms.length > 0) {
          const hasPlatform = bus.platforms.some((p) =>
            selectedBusPlatforms.some((sp) => p.name.toLowerCase().includes(sp.toLowerCase()))
          );
          if (!hasPlatform) return false;
        }
        if (operatorSearch.trim()) {
          if (!bus.operator.toLowerCase().includes(operatorSearch.toLowerCase().trim())) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        const aLowest = Math.min(...a.platforms.map((p) => p.price));
        const bLowest = Math.min(...b.platforms.map((p) => p.price));
        if (sortBy === "priceLow") return aLowest - bLowest;
        if (sortBy === "priceHigh") return bLowest - aLowest;
        if (sortBy === "fastest") return a.durationMins - b.durationMins;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0;
      });
  }, [
    generatedRealBuses,
    maxPrice,
    selectedBusTypes,
    selectedSeating,
    selectedTimes,
    selectedOperators,
    selectedBusPlatforms,
    operatorSearch,
    sortBy,
  ]);

  return (
    <div className="transport-results-page-container">
      {/* =========================================================
          TOP HEADER BANNER SHOWCASE
          ========================================================= */}
      <div
        className={`results-header-banner ${
          isCab
            ? "cab-theme-banner"
            : isFlight
            ? "flight-theme-banner"
            : isTrain
            ? "train-theme-banner"
            : "bus-theme-banner"
        }`}
        style={{
          backgroundImage: isCab
            ? `url(${cabHeaderBgImg})`
            : isFlight
            ? `url(${flightHeaderBgImg})`
            : isTrain
            ? `linear-gradient(180deg, rgba(15, 23, 42, 0.45) 0%, rgba(15, 23, 42, 0.92) 100%), url(${trainHeaderBgImg})`
            : `linear-gradient(180deg, rgba(15, 23, 42, 0.78) 0%, rgba(15, 23, 42, 0.94) 100%), url(${busHeaderBgImg})`,
        }}
      >
        <div className="banner-top-row">
          <div className="banner-title-col">
            {isCab ? (
              <div className="cab-header-mode-badge">
                <FaCar className="header-cab-icon" />
                <span>Cabs</span>
              </div>
            ) : isFlight ? (
              <div className="flight-header-mode-badge">
                <FaPlane className="header-flight-icon" />
                <span>Flights</span>
              </div>
            ) : isTrain ? (
              <div className="train-header-mode-badge">
                <FaTrainSubway className="header-train-icon" />
                <span>Trains</span>
              </div>
            ) : null}

            <h1 className="banner-heading">
              {isCab ? (
                <>
                  Comfortable Rides, <span className="highlight-blue-text">Anywhere in India</span>
                </>
              ) : isFlight ? (
                "Fly to 1000+ Destinations"
              ) : isTrain ? (
                <>
                  Book Train Tickets <span className="highlight-blue-text">Across India</span>
                </>
              ) : (
                <>
                  Book Bus Tickets <span className="highlight-blue-text">Across India</span>
                </>
              )}
            </h1>

            <p className="banner-subheading">
              {isCab
                ? "Compare prices from top cab providers and book your ride at the best deal — all in one place."
                : isFlight
                ? "Compare prices from all major airlines and book at the best deal — all in one place."
                : isTrain
                ? "Compare prices from all major platforms and get the best deals in one place."
                : "Compare live fares across redBus, AbhiBus, MakeMyTrip & goibibo — book at guaranteed lowest prices."}
            </p>
          </div>

          <div className="banner-badges-row">
            {isCab ? (
              <>
                <div className="banner-badge-pill">
                  <span className="badge-circle circle-blue">
                    <FaTag />
                  </span>
                  <span>Best Prices</span>
                </div>
                <div className="banner-badge-pill">
                  <span className="badge-circle circle-emerald">
                    <FaShieldHalved />
                  </span>
                  <span>Verified Drivers</span>
                </div>
                <div className="banner-badge-pill">
                  <span className="badge-circle circle-purple">
                    <FaClock />
                  </span>
                  <span>Real-time Availability</span>
                </div>
                <div className="banner-badge-pill">
                  <span className="badge-circle circle-amber">
                    <FaStar />
                  </span>
                  <span>Wide Vehicle Options</span>
                </div>
              </>
            ) : isFlight ? (
              <>
                <div className="banner-badge-pill">
                  <span className="badge-circle circle-blue">
                    <FaTag />
                  </span>
                  <span>Best Prices</span>
                </div>
                <div className="banner-badge-pill">
                  <span className="badge-circle circle-emerald">
                    <FaShieldHalved />
                  </span>
                  <span>All Major Airlines</span>
                </div>
                <div className="banner-badge-pill">
                  <span className="badge-circle circle-purple">
                    <FaClock />
                  </span>
                  <span>Real-time Availability</span>
                </div>
                <div className="banner-badge-pill">
                  <span className="badge-circle circle-amber">
                    <FaRepeat />
                  </span>
                  <span>Easy Cancellation</span>
                </div>
              </>
            ) : isTrain ? (
              <>
                <div className="banner-badge-pill">
                  <span className="badge-circle circle-blue">
                    <FaClock />
                  </span>
                  <span>Real-time Availability</span>
                </div>
                <div className="banner-badge-pill">
                  <span className="badge-circle circle-emerald">
                    <FaShieldHalved />
                  </span>
                  <span>All Classes &amp; Quotas</span>
                </div>
                <div className="banner-badge-pill">
                  <span className="badge-circle circle-amber">
                    <FaStar />
                  </span>
                  <span>Trusted Partners</span>
                </div>
              </>
            ) : (
              <>
                <div className="banner-badge-pill">
                  <span className="badge-circle circle-blue">
                    <FaTag />
                  </span>
                  <span>redBus &amp; AbhiBus Verified</span>
                </div>
                <div className="banner-badge-pill">
                  <span className="badge-circle circle-emerald">
                    <FaShieldHalved />
                  </span>
                  <span>Live Seat Selection</span>
                </div>
                <div className="banner-badge-pill">
                  <span className="badge-circle circle-purple">
                    <FaClock />
                  </span>
                  <span>Real-time Tracking</span>
                </div>
                <div className="banner-badge-pill">
                  <span className="badge-circle circle-amber">
                    <FaStar />
                  </span>
                  <span>Lowest Price Guarantee</span>
                </div>
              </>
            )}

            {isTrain && (
              <div className="train-india-better-tag">
                <span>Travel India Better</span>
                <span className="flag-icon">🇮🇳</span>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================
            FLOATING SEARCH CARD (WITH MODE TABS MATCHING SCREENSHOT)
            ========================================================= */}
        <div className="results-floating-search-card">
          <div className="search-card-top-controls-row">
            <div className="search-mode-tabs-row">
              <button
                type="button"
                className={`search-mode-tab-btn ${selectedMode === "train" ? "active-tab" : ""}`}
                onClick={() => onSelectMode && onSelectMode("train")}
              >
                <FaTrainSubway className="mode-tab-icon" />
                <span>Train</span>
              </button>
              <button
                type="button"
                className={`search-mode-tab-btn ${selectedMode === "flight" ? "active-tab" : ""}`}
                onClick={() => onSelectMode && onSelectMode("flight")}
              >
                <FaPlane className="mode-tab-icon" />
                <span>Flight</span>
              </button>
              <button
                type="button"
                className={`search-mode-tab-btn ${selectedMode === "bus" ? "active-tab" : ""}`}
                onClick={() => onSelectMode && onSelectMode("bus")}
              >
                <FaBus className="mode-tab-icon" />
                <span>Bus</span>
              </button>
              <button
                type="button"
                className={`search-mode-tab-btn ${selectedMode === "cab" ? "active-tab" : ""}`}
                onClick={() => onSelectMode && onSelectMode("cab")}
              >
                <FaCar className="mode-tab-icon" />
                <span>Cab</span>
              </button>
            </div>

            {/* Trip Type Pills on top right (for Flights & Cabs) */}
            {isCab ? (
              <div className="flight-trip-types-row">
                <button
                  type="button"
                  className={`flight-trip-pill ${cabTripType === "oneway" ? "active" : ""}`}
                  onClick={() => setCabTripType("oneway")}
                >
                  One Way
                </button>
                <button
                  type="button"
                  className={`flight-trip-pill ${cabTripType === "roundtrip" ? "active" : ""}`}
                  onClick={() => setCabTripType("roundtrip")}
                >
                  Round Trip
                </button>
                <button
                  type="button"
                  className={`flight-trip-pill ${cabTripType === "hourly" ? "active" : ""}`}
                  onClick={() => setCabTripType("hourly")}
                >
                  Hourly
                </button>
              </div>
            ) : isFlight ? (
              <div className="flight-trip-types-row">
                <button
                  type="button"
                  className={`flight-trip-pill ${selectedTripType === "oneway" ? "active" : ""}`}
                  onClick={() => setSelectedTripType("oneway")}
                >
                  One Way
                </button>
                <button
                  type="button"
                  className={`flight-trip-pill ${selectedTripType === "roundtrip" ? "active" : ""}`}
                  onClick={() => setSelectedTripType("roundtrip")}
                >
                  Round Trip
                </button>
                <button
                  type="button"
                  className={`flight-trip-pill ${selectedTripType === "multicity" ? "active" : ""}`}
                  onClick={() => setSelectedTripType("multicity")}
                >
                  Multi-City
                </button>
              </div>
            ) : null}
          </div>

          <div className="search-fields-inline-row">
            {/* FROM */}
            <div className="search-box-cell cell-from">
              <PlaceAutocomplete
                value={origin}
                onChange={(val) => onUpdateParams && onUpdateParams({ origin: val })}
                placeholder={isCab ? "Pickup Location" : "Origin City"}
                label={isCab ? "Pickup Location" : "From"}
                mode={selectedMode}
                fieldRole="origin"
              />
            </div>

            {/* SWAP */}
            <button
              type="button"
              className="search-swap-trigger"
              onClick={() => {
                onUpdateParams &&
                  onUpdateParams({
                    origin: destination,
                    destination: origin,
                  });
              }}
              title="Swap Locations"
            >
              <FaRepeat />
            </button>

            {/* TO */}
            <div className="search-box-cell cell-to">
              <PlaceAutocomplete
                value={destination}
                onChange={(val) => onUpdateParams && onUpdateParams({ destination: val })}
                placeholder={isCab ? "Drop Location" : "Destination City"}
                label={isCab ? "Drop Location" : "To"}
                mode={selectedMode}
                fieldRole="destination"
              />
            </div>

            {/* JOURNEY DATE */}
            <div className="search-box-cell cell-date">
              <TravelDatePicker
                selectedDate={searchParams?.departureDate}
                onDateChange={(newDate) =>
                  onUpdateParams && onUpdateParams({ departureDate: newDate })
                }
                label={
                  isCab
                    ? "Pickup Date & Time"
                    : isFlight
                    ? "Departure Date"
                    : isTrain
                    ? "Journey Date"
                    : "Date"
                }
              />
            </div>

            {/* PASSENGERS */}
            <div
              className="search-box-cell cell-passengers"
              style={{ position: "relative", cursor: "pointer" }}
              onClick={() => setPassengerDropdownOpen(!passengerDropdownOpen)}
            >
              <FaUser className="cell-icon" />
              <div className="cell-col">
                <span className="cell-label">Passengers</span>
                <div className="passengers-display-row">
                  <span className="cell-value">
                    {isCab
                      ? `${passengers} Passengers`
                      : isFlight
                      ? `${passengers} Adult, Economy`
                      : `${passengers} ${isTrain ? "Adult" : "Passenger"}`}
                  </span>
                  <FaChevronDown className="chevron-mini" />
                </div>
              </div>
              {passengerDropdownOpen && (
                <div
                  className="passengers-popover"
                  onClick={(e) => e.stopPropagation()}
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      className={`passenger-option-btn ${
                        Number(passengers) === num ? "selected" : ""
                      }`}
                      onClick={() => {
                        onUpdateParams && onUpdateParams({ passengers: num });
                        setPassengerDropdownOpen(false);
                      }}
                    >
                      <span>
                        {num}{" "}
                        {num === 1
                          ? isTrain
                            ? "Adult"
                            : "Passenger"
                          : isTrain
                          ? "Adults"
                          : "Passengers"}
                      </span>
                      {Number(passengers) === num && (
                        <FaCircleCheck
                          className="check-icon"
                          style={{ color: "var(--s-accent-green, #10b981)", fontSize: "12px" }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ACTION */}
            <button
              type="button"
              className="search-action-btn-primary"
              onClick={onReSearch}
            >
              <FaMagnifyingGlass className="btn-search-icon" />
              <span>
                {isCab
                  ? "Search Cabs"
                  : isFlight
                  ? "Search Flights"
                  : isTrain
                  ? "Search Trains"
                  : "Search Buses"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================
          MAIN MULTI-COLUMN RESULTS LAYOUT
          ========================================================= */}
      <div
        className={`results-content-layout ${
          isCab ? "cab-three-col-layout" : ""
        }`}
      >
        {/* ========================
            LEFT COLUMN: FILTERS
            ======================== */}
        <aside className="results-filters-sidebar">
          <div className="filters-header-row">
            <h2 className="filters-title">Filters</h2>
            <button
              type="button"
              className="btn-clear-filters"
              onClick={handleClearAll}
            >
              Clear All
            </button>
          </div>

          {/* PRICE RANGE */}
          <div className="filter-section-card">
            <div className="filter-section-header">
              <span className="filter-header-label">Price Range</span>
              <FaChevronUp className="filter-header-arrow" />
            </div>
            <div className="filter-price-display">
              <span>
                {isCab
                  ? `₹ 200 - ₹ ${cabMaxPrice.toLocaleString()}`
                  : isFlight
                  ? `₹ 2,000 - ₹ ${flightMaxPrice.toLocaleString()}`
                  : `₹0 - ₹${maxPrice.toLocaleString()}`}
              </span>
            </div>
            <div className="filter-slider-wrap">
              <input
                type="range"
                min={isCab ? "200" : isFlight ? "2000" : "0"}
                max={isCab ? "25000" : isFlight ? "50000" : isTrain ? "5000" : "3000"}
                step={isCab ? "200" : isFlight ? "500" : "100"}
                value={isCab ? cabMaxPrice : isFlight ? flightMaxPrice : maxPrice}
                onChange={(e) => {
                  if (isCab) setCabMaxPrice(Number(e.target.value));
                  else if (isFlight) setFlightMaxPrice(Number(e.target.value));
                  else setMaxPrice(Number(e.target.value));
                }}
                className="price-range-slider"
              />
            </div>
          </div>

          {/* CAB SPECIFIC FILTERS */}
          {isCab ? (
            <>
              {/* VEHICLE TYPE */}
              <div className="filter-section-card">
                <div className="filter-section-header">
                  <span className="filter-header-label">Vehicle Type</span>
                  <FaChevronUp className="filter-header-arrow" />
                </div>
                <div className="filter-checkbox-list">
                  {CAB_VEHICLE_TYPES.map((vt) => (
                    <label key={vt.label} className="filter-checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedVehicleTypes.includes(vt.label)}
                        onChange={() =>
                          toggleListFilter(selectedVehicleTypes, setSelectedVehicleTypes, vt.label)
                        }
                      />
                      <span className="chk-label">{vt.label}</span>
                      <span className="chk-count">({vt.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* FUEL TYPE */}
              <div className="filter-section-card">
                <div className="filter-section-header">
                  <span className="filter-header-label">Fuel Type</span>
                  <FaChevronUp className="filter-header-arrow" />
                </div>
                <div className="filter-checkbox-list">
                  {CAB_FUEL_TYPES.map((ft) => (
                    <label key={ft.label} className="filter-checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedFuelTypes.includes(ft.label)}
                        onChange={() =>
                          toggleListFilter(selectedFuelTypes, setSelectedFuelTypes, ft.label)
                        }
                      />
                      <span className="chk-label">{ft.label}</span>
                      <span className="chk-count">({ft.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* SEATING CAPACITY */}
              <div className="filter-section-card">
                <div className="filter-section-header">
                  <span className="filter-header-label">Seating Capacity</span>
                  <FaChevronUp className="filter-header-arrow" />
                </div>
                <div className="filter-checkbox-list">
                  {CAB_CAPACITY_OPTIONS.map((sc) => (
                    <label key={sc.label} className="filter-checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedCapacities.includes(sc.label)}
                        onChange={() =>
                          toggleListFilter(selectedCapacities, setSelectedCapacities, sc.label)
                        }
                      />
                      <span className="chk-label">{sc.label}</span>
                      <span className="chk-count">({sc.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* CAB OPERATORS */}
              <div className="filter-section-card">
                <div className="filter-section-header">
                  <span className="filter-header-label">Cab Operators</span>
                  <FaChevronUp className="filter-header-arrow" />
                </div>

                <div className="filter-search-box">
                  <FaMagnifyingGlass className="search-box-icon" />
                  <input
                    type="text"
                    placeholder="Search operator..."
                    value={cabOperatorSearch}
                    onChange={(e) => setCabOperatorSearch(e.target.value)}
                  />
                </div>

                <div className="filter-checkbox-list operator-list-scroll">
                  {CAB_OPERATOR_LIST.filter(
                    (op) =>
                      !cabOperatorSearch ||
                      op.name.toLowerCase().includes(cabOperatorSearch.toLowerCase().trim())
                  ).map((op) => (
                    <label key={op.name} className="filter-checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedCabOperators.includes(op.name)}
                        onChange={() =>
                          toggleListFilter(selectedCabOperators, setSelectedCabOperators, op.name)
                        }
                      />
                      <span className="chk-label">{op.name}</span>
                      <span className="chk-count">({op.count})</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          ) : isFlight ? (
            /* FLIGHT FILTERS */
            <>
              {/* STOPS */}
              <div className="filter-section-card">
                <div className="filter-section-header">
                  <span className="filter-header-label">Stops</span>
                  <FaChevronUp className="filter-header-arrow" />
                </div>
                <div className="filter-checkbox-list">
                  {FLIGHT_STOPS_METADATA.map((st) => (
                    <label key={st.label} className="filter-checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedStops.includes(st.label)}
                        onChange={() => toggleListFilter(selectedStops, setSelectedStops, st.label)}
                      />
                      <span className="chk-label">{st.label}</span>
                      <span className="chk-count">({st.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* DEPARTURE TIME */}
              <div className="filter-section-card">
                <div className="filter-section-header">
                  <span className="filter-header-label">Departure Time</span>
                  <FaChevronUp className="filter-header-arrow" />
                </div>
                <div className="filter-checkbox-list">
                  <label className="filter-checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedTimes.includes("Morning")}
                      onChange={() => toggleListFilter(selectedTimes, setSelectedTimes, "Morning")}
                    />
                    <span className="chk-label">Morning (6 AM – 12 PM)</span>
                  </label>
                  <label className="filter-checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedTimes.includes("Afternoon")}
                      onChange={() => toggleListFilter(selectedTimes, setSelectedTimes, "Afternoon")}
                    />
                    <span className="chk-label">Afternoon (12 PM – 6 PM)</span>
                  </label>
                  <label className="filter-checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedTimes.includes("Evening")}
                      onChange={() => toggleListFilter(selectedTimes, setSelectedTimes, "Evening")}
                    />
                    <span className="chk-label">Evening (6 PM – 12 AM)</span>
                  </label>
                  <label className="filter-checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedTimes.includes("Night")}
                      onChange={() => toggleListFilter(selectedTimes, setSelectedTimes, "Night")}
                    />
                    <span className="chk-label">Night (12 AM – 6 AM)</span>
                  </label>
                </div>
              </div>

              {/* AIRLINES */}
              <div className="filter-section-card">
                <div className="filter-section-header">
                  <span className="filter-header-label">Airlines</span>
                  <FaChevronUp className="filter-header-arrow" />
                </div>

                <div className="filter-search-box">
                  <FaMagnifyingGlass className="search-box-icon" />
                  <input
                    type="text"
                    placeholder="Search airline..."
                    value={airlineSearch}
                    onChange={(e) => setAirlineSearch(e.target.value)}
                  />
                </div>

                <div className="filter-checkbox-list operator-list-scroll">
                  {FLIGHT_AIRLINES_METADATA.filter(
                    (al) =>
                      !airlineSearch ||
                      al.name.toLowerCase().includes(airlineSearch.toLowerCase().trim())
                  ).map((al) => (
                    <label key={al.name} className="filter-checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedAirlines.includes(al.name)}
                        onChange={() =>
                          toggleListFilter(selectedAirlines, setSelectedAirlines, al.name)
                        }
                      />
                      <span className="chk-label">{al.name}</span>
                      <span className="chk-count">({al.count})</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          ) : isTrain ? (
            /* TRAIN FILTERS */
            <>
              {/* QUOTA */}
              <div className="filter-section-card">
                <div className="filter-section-header">
                  <span className="filter-header-label">Quota</span>
                  <FaChevronUp className="filter-header-arrow" />
                </div>
                <div className="filter-checkbox-list">
                  <label className="filter-checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedQuota.includes("General")}
                      onChange={() => toggleListFilter(selectedQuota, setSelectedQuota, "General")}
                    />
                    <span className="chk-label">General</span>
                    <span className="chk-count">(312)</span>
                  </label>
                  <label className="filter-checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedQuota.includes("Tatkal")}
                      onChange={() => toggleListFilter(selectedQuota, setSelectedQuota, "Tatkal")}
                    />
                    <span className="chk-label">Tatkal</span>
                    <span className="chk-count">(42)</span>
                  </label>
                  <label className="filter-checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedQuota.includes("Premium Tatkal")}
                      onChange={() =>
                        toggleListFilter(selectedQuota, setSelectedQuota, "Premium Tatkal")
                      }
                    />
                    <span className="chk-label">Premium Tatkal</span>
                    <span className="chk-count">(28)</span>
                  </label>
                </div>
              </div>

              {/* CLASS */}
              <div className="filter-section-card">
                <div className="filter-section-header">
                  <span className="filter-header-label">Class</span>
                  <FaChevronUp className="filter-header-arrow" />
                </div>
                <div className="filter-checkbox-list">
                  {[
                    { label: "Sleeper (SL)", count: 86 },
                    { label: "3AC (3A)", count: 102 },
                    { label: "2AC (2A)", count: 74 },
                    { label: "1AC (1A)", count: 32 },
                    { label: "Chair Car (CC)", count: 28 },
                    { label: "Second Sitting (2S)", count: 14 },
                  ].map((c) => (
                    <label key={c.label} className="filter-checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedClass.includes(c.label)}
                        onChange={() => toggleListFilter(selectedClass, setSelectedClass, c.label)}
                      />
                      <span className="chk-label">{c.label}</span>
                      <span className="chk-count">({c.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* DEPARTURE TIME */}
              <div className="filter-section-card">
                <div className="filter-section-header">
                  <span className="filter-header-label">Departure Time</span>
                  <FaChevronUp className="filter-header-arrow" />
                </div>
                <div className="filter-checkbox-list">
                  <label className="filter-checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedTimes.includes("Morning")}
                      onChange={() => toggleListFilter(selectedTimes, setSelectedTimes, "Morning")}
                    />
                    <span className="chk-label">Morning (6 AM – 12 PM)</span>
                    <span className="chk-count">(78)</span>
                  </label>
                  <label className="filter-checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedTimes.includes("Afternoon")}
                      onChange={() => toggleListFilter(selectedTimes, setSelectedTimes, "Afternoon")}
                    />
                    <span className="chk-label">Afternoon (12 PM – 6 PM)</span>
                    <span className="chk-count">(94)</span>
                  </label>
                  <label className="filter-checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedTimes.includes("Evening")}
                      onChange={() => toggleListFilter(selectedTimes, setSelectedTimes, "Evening")}
                    />
                    <span className="chk-label">Evening (6 PM – 12 AM)</span>
                    <span className="chk-count">(98)</span>
                  </label>
                  <label className="filter-checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedTimes.includes("Night")}
                      onChange={() => toggleListFilter(selectedTimes, setSelectedTimes, "Night")}
                    />
                    <span className="chk-label">Night (12 AM – 6 AM)</span>
                    <span className="chk-count">(42)</span>
                  </label>
                </div>
              </div>

              {/* TRAIN TYPE */}
              <div className="filter-section-card">
                <div className="filter-section-header">
                  <span className="filter-header-label">Train Type</span>
                  <FaChevronUp className="filter-header-arrow" />
                </div>
                <div className="filter-checkbox-list">
                  {[
                    { label: "Rajdhani", count: 12 },
                    { label: "Shatabdi", count: 10 },
                    { label: "Vande Bharat", count: 18 },
                    { label: "Superfast", count: 196 },
                    { label: "Express", count: 76 },
                    { label: "Passenger", count: 8 },
                  ].map((tt) => (
                    <label key={tt.label} className="filter-checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedTrainTypes.includes(tt.label)}
                        onChange={() =>
                          toggleListFilter(selectedTrainTypes, setSelectedTrainTypes, tt.label)
                        }
                      />
                      <span className="chk-label">{tt.label}</span>
                      <span className="chk-count">({tt.count})</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* BUS FILTERS */
            <>
              {/* BUS TYPE */}
              <div className="filter-section-card">
                <div className="filter-section-header">
                  <span className="filter-header-label">Bus Type</span>
                  <FaChevronUp className="filter-header-arrow" />
                </div>
                <div className="filter-checkbox-list">
                  <label className="filter-checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedBusTypes.includes("AC")}
                      onChange={() => toggleListFilter(selectedBusTypes, setSelectedBusTypes, "AC")}
                    />
                    <span className="chk-label">AC</span>
                    <span className="chk-count">(214)</span>
                  </label>
                  <label className="filter-checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedBusTypes.includes("Non-AC")}
                      onChange={() =>
                        toggleListFilter(selectedBusTypes, setSelectedBusTypes, "Non-AC")
                      }
                    />
                    <span className="chk-label">Non-AC</span>
                    <span className="chk-count">(86)</span>
                  </label>
                </div>
              </div>

              {/* SEATING TYPE */}
              <div className="filter-section-card">
                <div className="filter-section-header">
                  <span className="filter-header-label">Seating Type</span>
                  <FaChevronUp className="filter-header-arrow" />
                </div>
                <div className="filter-checkbox-list">
                  <label className="filter-checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedSeating.includes("Seater")}
                      onChange={() =>
                        toggleListFilter(selectedSeating, setSelectedSeating, "Seater")
                      }
                    />
                    <span className="chk-label">Seater</span>
                    <span className="chk-count">(145)</span>
                  </label>
                  <label className="filter-checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedSeating.includes("Sleeper")}
                      onChange={() =>
                        toggleListFilter(selectedSeating, setSelectedSeating, "Sleeper")
                      }
                    />
                    <span className="chk-label">Sleeper</span>
                    <span className="chk-count">(102)</span>
                  </label>
                </div>
              </div>

              {/* DEPARTURE TIME */}
              <div className="filter-section-card">
                <div className="filter-section-header">
                  <span className="filter-header-label">Departure Time</span>
                  <FaChevronUp className="filter-header-arrow" />
                </div>
                <div className="filter-checkbox-list">
                  <label className="filter-checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedTimes.includes("Morning")}
                      onChange={() => toggleListFilter(selectedTimes, setSelectedTimes, "Morning")}
                    />
                    <span className="chk-label">Morning (6 AM – 12 PM)</span>
                    <span className="chk-count">(98)</span>
                  </label>
                  <label className="filter-checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedTimes.includes("Afternoon")}
                      onChange={() => toggleListFilter(selectedTimes, setSelectedTimes, "Afternoon")}
                    />
                    <span className="chk-label">Afternoon (12 PM – 6 PM)</span>
                    <span className="chk-count">(76)</span>
                  </label>
                  <label className="filter-checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedTimes.includes("Evening")}
                      onChange={() => toggleListFilter(selectedTimes, setSelectedTimes, "Evening")}
                    />
                    <span className="chk-label">Evening (6 PM – 12 AM)</span>
                    <span className="chk-count">(112)</span>
                  </label>
                  <label className="filter-checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedTimes.includes("Night")}
                      onChange={() => toggleListFilter(selectedTimes, setSelectedTimes, "Night")}
                    />
                    <span className="chk-label">Night (12 AM – 6 AM)</span>
                    <span className="chk-count">(54)</span>
                  </label>
                </div>
              </div>

              {/* BOOKING PLATFORM (redBus, AbhiBus, MakeMyTrip, goibibo) */}
              <div className="filter-section-card">
                <div className="filter-section-header">
                  <span className="filter-header-label">Booking Platform</span>
                  <FaChevronUp className="filter-header-arrow" />
                </div>
                <div className="filter-checkbox-list">
                  {[
                    { name: "redBus", tag: "Lowest Fares", count: 16, color: "#d82b40" },
                    { name: "AbhiBus", tag: "Exclusive Deals", count: 16, color: "#b71a2a" },
                    { name: "MakeMyTrip", tag: "MMT Assured", count: 16, color: "#ea580c" },
                    { name: "goibibo", tag: "GoCash", count: 16, color: "#f97316" },
                  ].map((plat) => (
                    <label key={plat.name} className="filter-checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedBusPlatforms.includes(plat.name)}
                        onChange={() =>
                          toggleListFilter(selectedBusPlatforms, setSelectedBusPlatforms, plat.name)
                        }
                      />
                      <span className="chk-label" style={{ fontWeight: 600, color: plat.color }}>
                        {plat.name}
                      </span>
                      <span className="chk-count">({plat.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* BUS OPERATORS */}
              <div className="filter-section-card">
                <div className="filter-section-header">
                  <span className="filter-header-label">Bus Operators</span>
                  <FaChevronUp className="filter-header-arrow" />
                </div>
                <div className="filter-search-box">
                  <FaMagnifyingGlass className="search-box-icon" />
                  <input
                    type="text"
                    placeholder="Search operator..."
                    value={operatorSearch}
                    onChange={(e) => setOperatorSearch(e.target.value)}
                  />
                </div>
                <div className="filter-checkbox-list operator-list-scroll">
                  {[
                    "Zingbus Plus",
                    "IntrCity SmartBus",
                    "VRL Travels",
                    "SRS Travels",
                    "Orange Tours",
                    "Neeta Tours",
                    "RS Yadav SmartBus",
                    "Hans Travels",
                    "Kallada Travels",
                    "Jabbar Travels",
                    "Citylink",
                    "Mahasagar Travels",
                    "Sharma Transports",
                    "KPN Travels",
                    "Greenline Travels",
                    "State Road Transport",
                  ].map((op) => (
                    <label key={op} className="filter-checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedOperators.includes(op)}
                        onChange={() =>
                          toggleListFilter(selectedOperators, setSelectedOperators, op)
                        }
                      />
                      <span className="chk-label">{op}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </aside>

        {/* ========================
            MIDDLE / MAIN LISTINGS
            ======================== */}
        <main className="results-listing-main">
          {/* Top Sort & Count Bar */}
          <div className="listing-top-bar">
            <div className="results-count-text">
              {isCab ? (
                <>
                  <strong>{filteredCabs.length} Real Cabs</strong> available on this corridor ({routeMetrics.road} km)
                </>
              ) : isFlight ? (
                <>
                  <strong>{filteredFlights.length} Live Flights</strong> available ({findCity(origin).airport.code} → {findCity(destination).airport.code})
                </>
              ) : isTrain ? (
                <>
                  <strong>{filteredTrains.length} Verified Trains</strong> running on this sector
                </>
              ) : (
                <>
                  <strong>{filteredBuses.length} Real Buses</strong> scheduled from {origin}
                </>
              )}
            </div>

            <div className="sort-by-wrap">
              <span className="sort-label">Sort by</span>
              <select
                className="sort-dropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recommended">Recommended</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="fastest">Fastest</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* ==============================
              CAB LISTING CARDS
              ============================== */}
          {isCab ? (
            <div className="cab-cards-stack">
              {filteredCabs.map((cab) => (
                <div key={cab.id} className="cab-card-item">
                  <div className="cab-card-main-content">
                    {/* Left: Car Photo & Badge */}
                    <div className="cab-col-photo-badge">
                      {cab.badge ? (
                        <span
                          className={`cab-badge-pill ${
                            cab.badge === "Eco Friendly" ? "badge-eco" : "badge-best-deal"
                          }`}
                        >
                          {cab.badge === "Eco Friendly" ? "🌿" : "✨"} {cab.badge}
                        </span>
                      ) : (
                        <div className="cab-badge-spacer" />
                      )}
                      <div className="cab-photo-wrap">
                        <img src={cab.image} alt={cab.name} className="cab-vehicle-img" />
                      </div>
                    </div>

                    {/* Middle Details: Name, Subtitle, Specs */}
                    <div className="cab-col-details">
                      <h3 className="cab-vehicle-name">{cab.name}</h3>
                      <p className="cab-vehicle-subtitle">{cab.subtitle}</p>

                      <div className="cab-specs-row">
                        <span className="cab-spec-item" title="Seating Capacity">
                          <FaUser className="spec-icon" /> {cab.capacity}
                        </span>
                        <span className="cab-spec-item" title="Luggage Bags">
                          <FaSuitcase className="spec-icon" /> {cab.bags} Bags
                        </span>
                        {cab.hasAc && (
                          <span className="cab-spec-item" title="Air Conditioning">
                            <FaSnowflake className="spec-icon" /> AC
                          </span>
                        )}
                        <span className="cab-spec-item" title="Fuel Type">
                          {cab.fuel === "Electric" ? (
                            <FaBolt className="spec-icon icon-electric" />
                          ) : (
                            <FaGasPump className="spec-icon" />
                          )}{" "}
                          {cab.fuel}
                        </span>
                      </div>
                    </div>

                    {/* Platforms Comparison Chips */}
                    <div className="cab-col-platforms">
                      <div className="cab-platforms-chips-row">
                        {cab.platforms.map((p, pIdx) => (
                          <div
                            key={pIdx}
                            className={`cab-platform-chip ${
                              p.isCheapest ? "lowest-price-active" : ""
                            }`}
                          >
                            <span className={`cab-provider-brand brand-${p.name.toLowerCase()}`}>
                              {p.name}
                            </span>
                            <span className="cab-provider-price">₹{p.price.toLocaleString()}</span>
                            {p.isCheapest && (
                              <span className="cab-lowest-price-tag">Lowest Price</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ETA, Distance & CTA */}
                    <div className="cab-col-eta-cta">
                      <div className="cab-eta-distance-col">
                        <span className="eta-badge">
                          <FaClock className="eta-icon" /> {cab.durationText}
                        </span>
                        <span className="distance-badge">
                          <FaRoad className="distance-icon" /> {cab.distanceText}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="btn-cab-book-ride"
                        onClick={() => onSelectBooking && onSelectBooking(cab)}
                      >
                        <span>Book Ride</span>
                        <FaArrowRight className="btn-arrow" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : isFlight ? (
            /* ==============================
                FLIGHT LISTING CARDS
                ============================== */
            <div className="flight-cards-stack">
              {filteredFlights.map((flight) => {
                const isExpanded = expandedFlightId === flight.id;
                return (
                  <div key={flight.id} className="flight-card-card">
                    <div className="flight-card-main-content">
                      {/* 1. Airline Brand Column */}
                      <div className="flight-col-airline">
                        <div className="flight-airline-avatar-wrap">
                          <img
                            src={flight.airlineLogo}
                            alt={flight.airlineName}
                            className="flight-airline-logo-img"
                          />
                        </div>
                        <div className="flight-airline-identity">
                          <h3 className="flight-airline-name">{flight.airlineName}</h3>
                          <span className="flight-code-label">{flight.flightNumber}</span>
                          <div className="flight-pill-status-row">
                            {flight.stops === "Non-stop" ? (
                              <span className="flight-tag-pill tag-green">
                                <FaCircleCheck className="pill-dot-icon" />
                                <span>Non-stop</span>
                              </span>
                            ) : (
                              <span className="flight-tag-pill tag-amber">
                                <span>{flight.stops}</span>
                              </span>
                            )}
                            <span className="flight-tag-pill tag-blue">
                              <FaClock className="pill-dot-icon" />
                              <span>On Time</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 2. Schedule Timeline Track */}
                      <div className="flight-col-timeline">
                        {/* Departure */}
                        <div className="flight-time-point time-dep">
                          <span className="time-val-bold">{flight.departureTime}</span>
                          <div className="airport-details">
                            <span className="airport-code-bold">{flight.originCode}</span>
                            <span className="airport-city-name">{flight.originCity}</span>
                          </div>
                          <span className="airport-terminal-tag">{flight.originTerminal}</span>
                        </div>

                        {/* Middle Track */}
                        <div className="flight-middle-route-line">
                          <span className="flight-duration-header">{flight.duration}</span>
                          <div className="flight-visual-line-bar">
                            <div className="line-segment" />
                            <FaPlane className="flight-flying-icon" />
                            <div className="line-segment" />
                          </div>
                          <span className="flight-via-subtext">{flight.viaText}</span>
                        </div>

                        {/* Arrival */}
                        <div className="flight-time-point time-arr">
                          <span className="time-val-bold">{flight.arrivalTime}</span>
                          <div className="airport-details">
                            <span className="airport-code-bold">{flight.destinationCode}</span>
                            <span className="airport-city-name">{flight.destinationCity}</span>
                          </div>
                          <span className="airport-terminal-tag">{flight.destinationTerminal}</span>
                        </div>
                      </div>

                      {/* 3. Inclusions List */}
                      <div className="flight-col-inclusions">
                        <div className="incl-item-row" title="Cabin Baggage">
                          <FaSuitcaseRolling className="incl-icon" />
                          <span>{flight.cabinBaggage}</span>
                        </div>
                        <div className="incl-item-row" title="Check-in Baggage">
                          <FaSuitcase className="incl-icon" />
                          <span>{flight.checkinBaggage}</span>
                        </div>
                        <div className="incl-item-row" title="Seat Selection">
                          <FaChair className="incl-icon" />
                          <span>{flight.seatType}</span>
                        </div>
                        <div className="incl-item-row" title="Meal Info">
                          <FaUtensils className="incl-icon" />
                          <span>{flight.mealType}</span>
                        </div>
                      </div>

                      {/* 4. Pricing & Action Button */}
                      <div className="flight-col-pricing-cta">
                        {flight.badge ? (
                          <div className="flight-cheapest-badge-pill">
                            <FaTag className="tag-icon-mini" />
                            <span>{flight.badge}</span>
                          </div>
                        ) : (
                          <div className="flight-cheapest-badge-placeholder" />
                        )}

                        <div className="flight-pricing-display">
                          <span className="flight-price-number">₹{flight.price.toLocaleString()}</span>
                          <span className="flight-price-unit">{flight.priceNote}</span>
                        </div>

                        <div className="flight-action-buttons-wrap">
                          <button
                            type="button"
                            className="btn-flight-view-deals-primary"
                            onClick={() => onSelectBooking && onSelectBooking(flight)}
                          >
                            <span>View Deals</span>
                            <FaArrowRight className="btn-arrow-icon" />
                          </button>
                          <button
                            type="button"
                            className={`btn-flight-chevron-toggle ${isExpanded ? "rotated" : ""}`}
                            onClick={() => setExpandedFlightId(isExpanded ? null : flight.id)}
                            title="Toggle fare breakdown"
                          >
                            <FaChevronDown />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Accordion Drawer */}
                    {isExpanded && (
                      <div className="flight-accordion-fare-drawer">
                        <span className="drawer-subhead">Compare Verified Deals Across Providers:</span>
                        <div className="flight-deals-provider-row">
                          {flight.platforms?.map((p, pIdx) => (
                            <div
                              key={pIdx}
                              className={`flight-deal-pill-card ${p.isCheapest ? "highlight-deal" : ""}`}
                              onClick={() => onSelectBooking && onSelectBooking(flight)}
                            >
                              <span className="deal-operator-name">{p.name}</span>
                              <span className="deal-fare-val">₹{p.price.toLocaleString()}</span>
                              {p.isCheapest && <span className="deal-best-pill">Lowest Fare</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : isTrain ? (
            /* ==============================
                TRAIN LISTING CARDS
                ============================== */
            <div className="bus-cards-stack train-cards-stack">
              {filteredTrains.map((tr) => {
                const isFav = !!favorites[tr.id];

                return (
                  <div key={tr.id} className="bus-listing-card train-listing-card">
                    <div className="bus-thumb-pane train-thumb-pane">
                      <img
                        src={tr.image}
                        alt={tr.name}
                        className="bus-photo-img train-photo-img"
                      />
                      {tr.badge && (
                        <span className="train-badge-fastest">
                          <FaBolt className="bolt-icon" /> {tr.badge}
                        </span>
                      )}
                    </div>

                    <div className="bus-middle-info-pane train-middle-info-pane">
                      <div className="operator-header-row">
                        <div className="operator-name-box">
                          <div className="railways-crest-circle">
                            <FaTrainSubway className="crest-rail-icon" />
                          </div>
                          <h3 className="operator-name train-full-title">
                            <span className="train-num">{tr.number}</span> {tr.name}
                          </h3>
                        </div>

                        <div className="operator-rating-chip">
                          <FaStar className="star-icon" />
                          <span className="rating-val">{tr.rating}</span>
                          <span className="reviews-val">({tr.reviewsCount} reviews)</span>
                        </div>
                      </div>

                      <p className="train-route-subtitle">
                        {tr.originStation} → {tr.destinationStation}
                      </p>

                      <div className="train-classes-pills-row">
                        {tr.classes.map((cls, cIdx) => (
                          <span key={cIdx} className="train-class-chip">
                            {cls}
                          </span>
                        ))}
                      </div>

                      <div className="bus-timeline-row train-timeline-row">
                        <div className="time-station-col time-departure">
                          <span className="time-bold">{tr.departureTime}</span>
                          <span className="station-name">{tr.originCode}</span>
                        </div>

                        <div className="timeline-middle-track">
                          <div className="track-line" />
                          <span className="track-duration">{tr.duration}</span>
                          <div className="track-line" />
                        </div>

                        <div className="time-station-col time-arrival">
                          <span className="time-bold">{tr.arrivalTime}</span>
                          <span className="station-name">{tr.arrivalSub}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bus-right-booking-pane train-right-booking-pane">
                      <div className="wishlist-row">
                        <button
                          type="button"
                          className={`btn-wishlist ${isFav ? "active" : ""}`}
                          onClick={() => toggleFavorite(tr.id)}
                          title="Save to Wishlist"
                        >
                          {isFav ? <FaHeart /> : <FaRegHeart />}
                        </button>
                      </div>

                      <div className="platforms-comparison-box">
                        <span className="platforms-compare-label">
                          Prices from different platforms ({tr.selectedClass})
                        </span>

                        <div className="platforms-row-boxes train-platforms-grid">
                          {tr.platforms.map((p, pIdx) => (
                            <div
                              key={pIdx}
                              className={`platform-price-chip ${
                                p.isCheapest ? "lowest-price-active" : ""
                              }`}
                            >
                              <span
                                className="platform-brand-text"
                                style={{ color: p.logoColor }}
                              >
                                {p.name}
                              </span>
                              <span className="platform-price-val">₹{p.price}</span>
                              {p.isCheapest && (
                                <span className="lowest-price-tag">Lowest Price</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="booking-cta-row">
                        <button
                          type="button"
                          className="btn-view-details-book btn-train-seats-book"
                          onClick={() => onSelectBooking && onSelectBooking(tr)}
                        >
                          <span>View Seats &amp; Book</span>
                          <FaArrowRight className="btn-arrow" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ==============================
                BUS LISTING CARDS
                ============================== */
            <div className="bus-cards-stack">
              {filteredBuses.map((bus) => {
                const isFav = !!favorites[bus.id];

                return (
                  <div key={bus.id} className="bus-listing-card">
                    <div className="bus-thumb-pane">
                      <img
                        src={bus.image}
                        alt={bus.operator}
                        className="bus-photo-img"
                      />
                      {bus.badge && (
                        <span className="bus-badge-top-rated">
                          <FaStar className="star-icon-mini" /> {bus.badge}
                        </span>
                      )}
                    </div>

                    <div className="bus-middle-info-pane">
                      <div className="operator-header-row">
                        <div className="operator-name-box">
                          <div
                            className="operator-avatar"
                            style={{ background: bus.operatorTheme }}
                          >
                            {bus.operatorInitials}
                          </div>
                          <h3 className="operator-name">{bus.operator}</h3>
                        </div>

                        <div className="operator-rating-chip">
                          <FaStar className="star-icon" />
                          <span className="rating-val">{bus.rating}</span>
                          <span className="reviews-val">({bus.reviewsCount} reviews)</span>
                        </div>
                      </div>

                      <p className="bus-model-subtitle">{bus.subtitle}</p>

                      <div className="bus-amenities-row">
                        {bus.amenities.map((item, idx) => {
                          const am = AMENITY_ICONS[item];
                          if (!am) return null;
                          const Icon = am.icon;
                          return (
                            <div key={idx} className="amenity-chip" title={am.label}>
                              <Icon className="amenity-icon" />
                              <span>{am.label}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="bus-timeline-row">
                        <div className="time-station-col time-departure">
                          <span className="time-bold">{bus.departureTime}</span>
                          <span className="station-name">{bus.departureLocation}</span>
                        </div>

                        <div className="timeline-middle-track">
                          <div className="track-line" />
                          <span className="track-duration">{bus.duration}</span>
                          <div className="track-line" />
                        </div>

                        <div className="time-station-col time-arrival">
                          <span className="time-bold">{bus.arrivalTime}</span>
                          <span className="station-name">{bus.arrivalLocation}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bus-right-booking-pane">
                      <div className="wishlist-row">
                        {bus.seatsAvailableText && (
                          <span className="bus-seats-count-badge" title="Live Seat Availability">
                            <FaChair className="seat-icon-mini" /> {bus.seatsAvailableText}
                          </span>
                        )}
                        <button
                          type="button"
                          className={`btn-wishlist ${isFav ? "active" : ""}`}
                          onClick={() => toggleFavorite(bus.id)}
                          title="Save to Wishlist"
                        >
                          {isFav ? <FaHeart /> : <FaRegHeart />}
                        </button>
                      </div>

                      <div className="platforms-comparison-box">
                        <span className="platforms-compare-label">
                          Compare Live Fares Across Platforms
                        </span>

                        <div className="platforms-row-boxes bus-platforms-grid">
                          {bus.platforms.map((p, idx) => (
                            <div
                              key={idx}
                              className={`platform-price-chip bus-platform-chip brand-${p.name.toLowerCase()} ${
                                p.isCheapest ? "lowest-price-active" : ""
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectBooking && onSelectBooking(bus, p);
                              }}
                              title={`Auto-fill & book on ${p.name} (₹${p.price.toLocaleString()})`}
                            >
                              <div className="plat-name-tag-row">
                                <span
                                  className="platform-brand-text"
                                  style={{ color: p.logoColor }}
                                >
                                  {p.displayName || p.name}
                                </span>
                                {p.isCheapest && (
                                  <span className="lowest-price-tag">Lowest Price</span>
                                )}
                              </div>
                              <span className="platform-price-val">₹{p.price.toLocaleString()}</span>
                              {p.dealText && (
                                <span className="plat-deal-text">{p.dealText}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="booking-cta-row">
                        <button
                          type="button"
                          className="btn-view-details-book btn-bus-seats-book"
                          onClick={() => {
                            const cheapest =
                              bus.platforms.find((p) => p.isCheapest) || bus.platforms[0];
                            onSelectBooking && onSelectBooking(bus, cheapest);
                          }}
                        >
                          <span>Select Seats &amp; Book</span>
                          <FaArrowRight className="btn-arrow" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* =========================================================
            RIGHT RAIL SIDEBAR: ROUTE MAP & WHY BOOK ON VEDIX (CAB ONLY)
            ========================================================= */}
        {isCab && (
          <aside className="cab-right-rail-sidebar">
            {/* 1. Map & Route Card */}
            <div className="cab-route-map-card">
              <div className="route-endpoints-header">
                <div className="route-endpoints-col">
                  <div className="endpoint-row">
                    <span className="route-dot dot-green" />
                    <span className="endpoint-text bold">{origin}</span>
                  </div>
                  <div className="endpoint-row">
                    <span className="route-dot dot-red" />
                    <span className="endpoint-text bold">{destination}</span>
                  </div>
                </div>
                <button type="button" className="btn-route-menu" title="Route options">
                  <FaEllipsisVertical />
                </button>
              </div>

              <div className="route-map-visual-wrap">
                <img
                  src={cabMapCanvasImg}
                  alt={`Route Map from ${origin} to ${destination} via ${highwayName}`}
                  className="route-map-img"
                />
              </div>

              <div className="route-metrics-footer">
                <div className="metrics-left">
                  <span className="metric-distance">{routeMetrics.road} km</span>
                  <span className="metric-duration">~ {Math.max(25, Math.round((routeMetrics.road / 60) * 60))} min</span>
                  <span className="metric-via">via {highwayName}</span>
                </div>
                <button
                  type="button"
                  className="btn-view-route-link"
                  onClick={() => {
                    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
                      origin
                    )}&destination=${encodeURIComponent(destination)}&travelmode=driving`;
                    window.open(url, "_blank");
                  }}
                >
                  <span>View Route</span>
                  <FaArrowRight className="arrow-link" />
                </button>
              </div>
            </div>

            {/* 2. Why Book Cabs on Vedix? Card */}
            <div className="cab-why-vedix-card">
              <div className="why-card-title-row">
                <FaShieldHalved className="why-shield-icon" />
                <h4 className="why-card-title">Why Book Cabs on Vedix?</h4>
              </div>

              <div className="why-benefits-list">
                <div className="benefit-item-row">
                  <FaCircleCheck className="benefit-check-icon" />
                  <span>Compare prices across top providers</span>
                </div>
                <div className="benefit-item-row">
                  <FaCircleCheck className="benefit-check-icon" />
                  <span>Verified &amp; safe drivers</span>
                </div>
                <div className="benefit-item-row">
                  <FaCircleCheck className="benefit-check-icon" />
                  <span>Multiple vehicle options</span>
                </div>
                <div className="benefit-item-row">
                  <FaCircleCheck className="benefit-check-icon" />
                  <span>Real-time availability</span>
                </div>
                <div className="benefit-item-row">
                  <FaCircleCheck className="benefit-check-icon" />
                  <span>Instant booking &amp; easy cancellation</span>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default TransportResultsPage;
