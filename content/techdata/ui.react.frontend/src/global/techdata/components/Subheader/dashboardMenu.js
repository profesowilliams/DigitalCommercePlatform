import React from "react";

export const dashboardMenu = (dashboardMenuItems) => {

    return (
    <div className="cmp-sub-header__wrapper__tablist__menu">
        {dashboardMenuItems.map((item, index) =>
            <div className="cmp-sub-header__wrapper__tablist__menu__item">
                <h2>{item.title}</h2>
                <a href={item.link ? item.link : "#"}>
                    <img src={item.imagePath}/>
                </a>
            </div>)}
    </div>)
}