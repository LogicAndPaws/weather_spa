var model = {
    prognoses:[
        {
            date: "12.05.2020",
            temperature: 1,
            weather: "Snow",
            wind: 5
        },
        {
            date: "13.05.2020",
            temperature: 9,
            weather: "Clouds",
            wind: 8
        },
        {
            date: "14.05.2020",
            temperature: 13,
            weather: "Rain",
            wind: 2
        },
        {
            date: "15.05.2020",
            temperature: 5,
            weather: "Sunny",
            wind: 1
        },
        {
            date: "16.05.2020",
            temperature: 7,
            weather: "Clouds",
            wind: 3
        }
    ]
};

weatherApp.controller("centerController", function ($scope){
    $scope.list = model    
});