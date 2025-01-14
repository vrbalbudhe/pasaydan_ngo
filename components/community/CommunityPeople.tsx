import React from "react";
import ProfileCard from "@/components/community/profileCard";
import shradhhaBorker from "@/assets/Community/profileUserImages/shradha_borker.png";
import vilasKhade from "@/assets/Community/profileUserImages/vilas_khade.png";

const ProfileUsersInformation = [
  {
    fullname: "VILAS KHADE",
    designation: "",
    link: vilasKhade.src,
  },
  {
    fullname: "RAJESH BADRE",
    designation: "",
    link: "https://www.remet.com/wp-content/uploads/2018/12/Rajesh-Cropped.jpg",
  },
  { fullname: "SHRADDHA BORKAR", designation: "", link: shradhhaBorker.src },
];

function CommunityPeople() {
  return (
    <>
      {ProfileUsersInformation.map((user, index) => (
        <ProfileCard
          key={index}
          fullname={user?.fullname}
          designation={user?.designation}
          link={user?.link}
        />
      ))}
    </>
  );
}

export default CommunityPeople;
