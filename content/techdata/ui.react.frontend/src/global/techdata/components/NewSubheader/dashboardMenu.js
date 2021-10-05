import React from "react";

export const dashboardMenu = (dashboardMenuItems, hasDCPAccess) => {
    let first = hasDCPAccess ? 2 : 0;
    let last = hasDCPAccess ? 0 : 2;
    return (
    <div className="cmp-sub-header__wrapper__tablist__menu">
        <div className="cmp-sub-header__wrapper__tablist__menu__item">
            <h2>{dashboardMenuItems[first].title}</h2>
            <a href={dashboardMenuItems[first].link ? dashboardMenuItems[first].link : "#"}>
                <img src={dashboardMenuItems[first].imagePath}/>
            </a>
        </div>
        <div className="cmp-sub-header__wrapper__tablist__menu__item">
            <h2>{dashboardMenuItems[1].title}</h2>
            <a href={dashboardMenuItems[1].link ? dashboardMenuItems[0].link : "#"}>
                <img src={dashboardMenuItems[1].imagePath}/>
            </a>
        </div>
        {hasDCPAccess ? <div className="cmp-sub-header__wrapper__tablist__menu__item">
            <h2>{dashboardMenuItems[last].title}</h2>
            <a href={dashboardMenuItems[last].link ? dashboardMenuItems[last].link : "#"}>
                <img src={dashboardMenuItems[last].imagePath}/>
            </a>
        </div> : null}
    </div>)
}