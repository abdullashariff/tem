export const CLEANING_COMPANIES = [
    "Du Be Sewage Technical Servoces",
    "RedSpot Environment Cleaning Servicees",
    "AL Ehsan",
    "RONS ENVIRO CARE L.L.C",
    "Top Clean Environment Services",
    "AL Serkal Group",
    "Mazmo Environment Services",
    "AL Amal Sewage Dranining L.L.C",
    "Well Fit Engineering Services",
    "Emvees Waste Water Treatment",
    "AL Taqwa",
    "Sanco Environmental Solutions",
    "Telco Middle EAST FZE",
    "Silver Corner",
    "Aluline Co. L.L.C",
    ""];

export const workClassList = ['GT clean', 'GT install', 'Septic tank clean'];
export const priorityList = ['High', 'Medium', 'Low'];
export const fogPercentageList = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
export const volumeList = ['25GL', '50GL', '75GL', '100GL', '150GL', '200GL'];
export const waterSourceList = ['FEWA', 'Bore well', 'Tanker'];
export const trapList = ['A', 'B', 'C', 'D', 'AG-1', 'AG-2', 'AG-3K', 'AG5'];
export const trapListSize = { A: 45, B: 120, C: 145, D: 15, 'AG-1': 30, 'AG-2': 30, 'AG-3K': 55, 'AG5': 145 };
export const activitytypeList = ['Restaurent', 'Hotel', 'Coffee Bar'];
export const customerStatusList = ['Pending', 'Done', 'Customer refuse'];
export const cleaningCountList = [1, 2, 3, 4];
export const gtInstalledCountList = [1, 2, 3, 4];
export const colors = ['#E38627', '#C13C37', '#6A2135', '#C13C37', '#C13C37', '#6A2135', '#E38627', '#C13C37', '#6A2135', '#C13C37'];


export const formatPieChartData = (activityTypes, key) => {
    let temp = [];
    var arrayObject = Object.keys(activityTypes);

    for (var i = 0; i < arrayObject.length; i++) {
        temp.push({ title: arrayObject[i], value: activityTypes[arrayObject[i]], color: colors[i] });
    }
    return temp;
}