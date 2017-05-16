var csv = require("fast-csv");// crime_rating= [{},{}] {region: "East" , rating:2.5 } 2dp
var fs = require("fs");
var exports= module.exports={};


 // array of all the regions

var regions=["North East","North West","Yorkshire and The Humber","East Midlands","West Midlands","Eastern","London","South East","South West","Wales","Scotland"];
var category=["Crime","Economy","Education","Employment","Housing","Population","Social"];

module.exports={
sortResults: function(myArray,prop, asc){
    return myArray = myArray.sort(function(a, b) {
            if (asc) {
                return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            } else {
                return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
            }
    });
  },
  
getCrimeRating: function(cb){
    var path = fs.createReadStream("./public/data/cat/Population_Meta.csv");
    var dataStore1=[];
    var populationList=[];
    // getting populatin info
    var csvStream = csv.fromStream(path, {headers : true})
                  .on("data", function(d) {
                  dataStore1.push({region: d["Regions"], population: Number(d["Total population"])});

                  }).on("end", function(){
                      //console.log(dataStore);
                  // pushing region and population data into populationList json
                      for(var i=0; i<regions.length;i++){
                          dataStore1.forEach(function(d){
                             if(d.region==regions[i]){
                            populationList.push(
                            {
                                region: regions[i],
                                population: d.population
                            });
                             } 
                          });
                      

                         //console.log("Index " +i+" Region: "+populationList[i].region+" population: "+populationList[i].population);
                           }
                                                      
                  });
    var dataStore2=[];
    var crime_array=[];
    var crime_rating=[];
// getting data and working out rating for crime    
    path= fs.createReadStream("./public/data/cat/Crime_Meta.csv")
    csvStream= csv.fromStream(path,{headers: true}).on("data", function(d){
        dataStore2.push( {region: d["Sub_Region"], totalCrime: Number(d["Total recorded crime (excluding fraud)"])} );
        
                    }).on("end", function(){
                        var crime
                        for(var i=0;i<regions.length;i++){
                            var totalRegionalCrime= 0;
                            
                            dataStore2.forEach(function(d){
                                if(regions[i]==d.region && typeof(d.totalCrime)!='undefined'){
                                    totalRegionalCrime= d.totalCrime;
                                    //console.log("Region: "+d.region+" total regional crime "+d.totalCrime);
                                }
                            });
                            
                            populationList.forEach(function(element){
                                if(element.region==regions[i]){
                                    population= element.population;
                                    crimedensity=totalRegionalCrime/population; // calculating crime density
                                    //console.log("region: "+element.region+" crimeDensity "+crimedensity);
                                }
                            });
                            
                            crime_array.push(// pushing all data into crime_array json
                                {
                                    region: regions[i],
                                    totalCrime: totalRegionalCrime,
                                    crimeDensity: crimedensity
                                }
                            );
                        }
                        //console.log(crime_array);
                        
                        //working out difference between each region's data
                        module.exports.sortResults(crime_array, "crimeDensity",true);// sorrting json by crime density in ascending order
                        var minCrimeDensity=0;
                        if(crime_array[0].crimeDensity==0){// for when we don't have crime data regarding a region
                            minCrimeDensity= crime_array[1].crimeDensity;
                        }
                        else{// else
                            minCrimeDensity= crime_array[0].crimeDensity;
                        }
                        //console.log("minCrimeDensity "+minCrimeDensity);
                        //console.log("minCrimeDensity "+crime_array[0].crimeDensity);
                        
                        // working out percentage
                        var percentage=0;
                        var temparray=[];
                        crime_array.forEach(function(element){
                            percentage= minCrimeDensity/element.crimeDensity;
                            //console.log("Region "+element.region+" percentage "+percentage);
                            temparray.push({// pushing all data into temp array json
                                region: element.region,
                                totalCrime: element.totalCrime,
                                crimeDensity: element.crimeDensity,
                                percentage: percentage
                            });
                   
                        });
                
                        crime_array=[];
                        crime_array=temparray;// transfering all info into crime_array json
                
                        //console.log(crime_array);
                        
                        // for loop used to work out rating for each region regarding crime and the data is stored in crime_rating json
                for(var i=0; i<crime_array.length;i++){
                    
                    if(crime_array[i].totalCrime===0){
                        crime_rating.push(
                            {
                                region: crime_array[i].region,
                                rating: 0
                            }
                        )
                    }
                    else{
                        crime_rating.push(
                            {
                                region: crime_array[i].region,
                                rating: (crime_array[i].percentage*5).toFixed(2)
                            }
                        )
                    }
                }
                module.exports.sortResults(crime_rating,"region",true);
                for(var i=0;i<crime_rating.length;i++){
                    //console.log("Region: "+crime_rating[i].region+" crime rating: "+crime_rating[i].rating);
                }
                return cb(crime_rating);
                
                    });// end of end function
  },
  
getEconomyRating: function(cb){
    var dataStore=[];
    var economy_array=[];
    var economy_rating=[];
    // getting data and working out rating for economy  
    path= fs.createReadStream("./public/data/cat/Economy_Meta.csv")
    csvStream= csv.fromStream(path,{headers: true}).on("data", function(d){
            dataStore.push( {
                            region: d["Sub_Region"], 
                            totalGVA: Number(d["Gross Value Added at current basic price"]), 
                            disposableIncome: Number(d["Gross disposable household income (per head)"]),
                            disposableIncomeIncrease: Number(d["Growth in gross disposable household income (%)"])} );
        
                    }).on("end", function(){
                        for(var i=0; i<regions.length;i++){
                            var totalgva= 0;
                            var averageDisposableIncome=0;
                            var averageDisposableIncomeIncrease=0;
                    
                            dataStore.forEach(function(d){
                                if(d.region==regions[i] && typeof(d.totalGVA)!='undefined'){
                                    totalgva = d.totalGVA;
                                }
                                if(d.region==regions[i] && typeof(d.disposableIncome)!='undefined'){
                                    averageDisposableIncome = d.disposableIncome;
                                    
                                    }
                                if(d.region==regions[i] &&  typeof(d.disposableIncomeIncrease)!='undefined'){
                                    averageDisposableIncomeIncrease = d.disposableIncomeIncrease;
                                }
                            });
                            //console.log("Region: "+regions[i]+" total gva "+totalgva+" total disposable income: "+averageDisposableIncome+" total disposable income increase: "+averageDisposableIncomeIncrease);
                            
                            economy_array.push(
                                {
                                    region: regions[i],
                                    gva: totalgva,
                                    disposableIncome: averageDisposableIncome,
                                    disposableIncomeIncrease: averageDisposableIncomeIncrease
                                }
                            );
                            
                            //console.log(economy_array);

                        }
                        
                        module.exports.sortResults(economy_array,"gva",false)// sorting gva in descending order
                            var maxGVA= economy_array[0].gva;
                            
                            var percentage=0;
                            var temparray=[];
                            
                            economy_array.forEach(function(element){// calculating rating for gva
                                percentage= element.gva/maxGVA;
                                //console.log("Region "+element.region+" percentage "+percentage);
                                temparray.push({// pushing all data into temp array json
                                    region: element.region,
                                    gva: element.gva,
                                    disposableIncome: element.disposableIncome,
                                    disposableIncomeIncrease: element.disposableIncomeIncrease,
                                    gvaPercentage: percentage,
                                    gvaTempRating: percentage*5
                           
                                });
                   
                            });
                            
                        economy_array=[];
                        economy_array=temparray;// transfering all info into economy_array json
                        temparray=[];
                        
                        module.exports.sortResults(economy_array,"disposableIncome",false);// sorting disposable income in descending order
                        var maxDI= economy_array[0].disposableIncome;// getting max disposable income
                        
                         economy_array.forEach(function(element){// calculating rating for disposable income
                            percentage= element.disposableIncome/maxDI;
                            //console.log("Region "+element.region+" percentage "+percentage);
                            temparray.push({// pushing all data into temp array json
                                region: element.region,
                                gva: element.gva,
                                disposableIncome: element.disposableIncome,
                                disposableIncomeIncrease: element.disposableIncomeIncrease,
                                gvaPercentage: element.gvaPercentage,
                                gvaTempRating: element.gvaTempRating,
                                giPercentage: percentage,
                                giTempRating: percentage*5
                           
                            });
                        });
                        
                        economy_array=[];
                        economy_array=temparray;// transfering all info into economy_array json
                        temparray=[];
                        
                        module.exports.sortResults(economy_array,"disposableIncomeIncrease",false)// sorting disposable income increase in descending order
                        var maxDII= economy_array[0].disposableIncomeIncrease;// getting max disposable income
                        
                        economy_array.forEach(function(element){
                            percentage= element.disposableIncomeIncrease/maxDII;
                            //console.log("Region "+element.region+" percentage "+percentage);
                            temparray.push({// pushing all data into temp array json
                                region: element.region,
                                gva: element.gva,
                                disposableIncome: element.disposableIncome,
                                disposableIncomeIncrease: element.disposableIncomeIncrease,
                                gvaPercentage: element.gvaPercentage,
                                gvaTempRating: element.gvaTempRating,
                                giPercentage: element.giPercentage,
                                giTempRating: element.giTempRating,
                                giiPercentage: percentage,
                                giiTempRating: percentage*5
                            });
                        });
                        
                        economy_array=[];
                        economy_array=temparray;// transfering all info into economy_array json
                        temparray=[];
                     
                        // for loop used to work out rating for each region regarding economy and the data is stored in economy_rating json
                        for(var i=0; i<economy_array.length;i++){
                    
                            var averageRating= (economy_array[i].gvaTempRating+economy_array[i].giTempRating+economy_array[i].giiTempRating)/3;
                            economy_rating.push(
                            {
                                region: economy_array[i].region,
                                rating: averageRating.toFixed(2)
                            }); 
                            //console.log("region: "+economy_array[i].region+" gva rating "+economy_array[i].gvaTempRating+" gross income rating "+economy_array[i].giTempRating+" gross income increase rating "+economy_array[i].giiTempRating+ "overall rating "+averageRating.toFixed(2));
                        }
                        
                        module.exports.sortResults(economy_rating,"region",true);
                        for(var i=0;i<economy_rating.length;i++){
                            //console.log("Region: "+economy_rating[i].region+" economy rating: "+economy_rating[i].rating);
                        }
                        return cb(economy_rating);
                        
                        
                    });// end function
  },
  
getEducationRating: function(cb){
      var dataStore=[];
      var education_array=[];
      var education_rating=[];
    // getting data and working out rating for education    
    path= fs.createReadStream("./public/data/cat/Education_Meta.csv")
    csvStream= csv.fromStream(path,{headers: true}).on("data", function(d){
            dataStore.push( {
                            region : d["Sub_Region"],
                            girlGCSC : Number(d["Girls 5+ A*-C grades including maths and english (%)"]),
                            boyGCSC : Number(d["Boys 5+ A*-C grades  including maths and english (%)"]),
                            belowStandard : Number(d["Percentage of schools below the floor standard"])} );
                            
                            //console.log("datastore "+dataStore.belowStandard);
        
                    }).on("end", function(){
                        for(var i=0; i<regions.length;i++){
                            var girlGCSCAverage=0;
                            var boyGCSCAverage=0;
                            var belowStandardAverage=0;
                            var overallAverage=0;
                        
                        
                            dataStore.forEach(function(d){
                                if(d.region==regions[i] && typeof(d.girlGCSC)!='undefined'){
                                    girlGCSCAverage = d.girlGCSC;
                                    //console.log("girls gcsc "+d.girlGCSC);
                                }
                                if(d.region==regions[i] && typeof(d.boyGCSC)!='undefined'){
                                    boyGCSCAverage = d.boyGCSC;
                                }
                                if(d.region==regions[i] && typeof(d.belowStandard)!='undefined'){
                                    belowStandardAverage = d.belowStandard;
                                }
                            });
                        
                            overallAverage= (girlGCSCAverage+boyGCSCAverage)/2; // overall boys and girls rating
                            //console.log("region "+regions[i]+" overall average grade: "+overallAverage+" below standard: "+belowStandardAverage);
                            education_array.push(
                                {
                                    region: regions[i],
                                    averageGrades: overallAverage,
                                    belowStandard: belowStandardAverage
                                });
                        }// end of for loop
                        
                        //console.log(education_array);
                        
                        module.exports.sortResults(education_array,"averageGrades",false); // sorting in average grade in descending order to get get max average grades
                        var maxGrade=education_array[0].averageGrades;// max grade
                        //console.log("max grade "+maxGrade);
                        
                        var percentage=0;
                        var temparray=[];
                        
                        education_array.forEach(function(element){// calculating rating for grades
                            percentage= element.averageGrades/maxGrade;
                            //console.log("Region "+element.region+" percentage "+percentage);
                    
                            temparray.push({// pushing all data into temp array json
                                region: element.region,
                                averageGrades: element.averageGrades,
                                belowStandard: element.belowStandard,
                                gradePercentage: percentage,
                                gradeTempRating: percentage*5
                            });
                   
                        });
                        
                        education_array=[];
                        education_array=temparray;// transfering all info into eduction_array json
                        temparray=[];
                        
                        module.exports.sortResults(education_array,"belowStandard",true); // sorting in below standard school in ascending order to get low below standard
                        var minBelowStandard=education_array[0].belowStandard;
                        //  console.log("min below standard "+minBelowStandard);
                        
                        var percentage=0;
                        var temparray=[];
                        education_array.forEach(function(element){// calculating rating for below standard
                            percentage= minBelowStandard/element.belowStandard;
                            //console.log("Region "+element.region+" percentage "+percentage);
                    
                            temparray.push({// pushing all data into temp array json
                                region: element.region,
                                averageGrades: element.averageGrades,
                                belowStandard: element.belowStandard,
                                gradePercentage: element.gradePercentage,
                                gradeTempRating: element.gradeTempRating,
                                belowStandardPercentage: percentage,
                                belowStandardTempRating: percentage*5
                            });
                        });
                        
                        education_array=[];
                        education_array=temparray;// transfering all info into education_array json
                        temparray=[];
                
                        // for loop used to work out rating for each region regarding education and the data is stored in education_rating json
                        for(var i=0; i<education_array.length;i++){
                    
                            var averageRating= (education_array[i].gradeTempRating+education_array[i].belowStandardTempRating)/2;
                            //console.log("region "+education_array[i].region+" grade rating: "+education_array[i].gradeTempRating+" below standard grade "+education_array[i].belowStandardTempRating);
                            // console.log("region "+education
                            education_rating.push(
                                {
                                region: education_array[i].region,
                                rating: averageRating.toFixed(2)
                                });
                        }
                        
                        module.exports.sortResults(education_rating,"region",true);
                        for(var i=0;i<education_rating.length;i++){
                            //console.log("Region: "+education_rating[i].region+" education rating: "+education_rating[i].rating);
                        }
                        
                        return cb(education_rating);
                
                        
                    });// end of end function
  },
  
getEmploymentRating: function(cb){
      var dataStore=[];
      var employment_array=[];
      var employment_rating=[];
      
    // getting data and working out rating for Employment   
    path= fs.createReadStream("./public/data/cat/Employment_Meta.csv")
    csvStream= csv.fromStream(path,{headers: true}).on("data", function(d){
            dataStore.push( {
                            region : d["Regions"],
                            employmentRate : Number(d["Employment Rate"]),
                            unemploymentRate : Number(d["Unemployment rate"]),
                            weeklyEarning : Number(d["Median Gross Weekly Earnings (GBP)"])});
                            
                            //console.log("datastore "+dataStore.belowStandard);
        
                    }).on("end", function(){
                        
                for(var i=0; i<regions.length;i++){

                    dataStore.forEach(function(d){           
                        if(d.region==regions[i]){
                            if(typeof(d.employmentRate)!='undefined' && typeof(d.unemploymentRate)!='undefined' && typeof(d.weeklyEarning)!='undefined'){
                                //console.log("Employment: Region: "+d.region+" employment rate: "+d.employmentRate+" unemployment rate "+d.unemploymentRate+" weekly earning "+d.weeklyEarning);
                                employment_array.push(
                                    {
                                        region: regions[i],
                                        employmentRate: d.employmentRate,
                                        unemploymentRate: d.unemploymentRate,
                                        weeklyEarning: d.weeklyEarning
                                    });
                            }
                        }
                    });
                }
                // calculating rating
                module.exports.sortResults(employment_array,"employmentRate",false); // sorting in descending order according to employment Rate
                var maxEmploymentRate=employment_array[0].employmentRate;// getting largest regional employment rate value
                
                var percentage=0;
                var temparray=[];
                employment_array.forEach(function(element){// calculating rating for employment rate
                       percentage= element.employmentRate/maxEmploymentRate
                       //console.log("Region "+element.region+" percentage "+percentage);
                    
                       temparray.push({// pushing all data into temp array json
                           region: element.region,
                           employmentRate: element.employmentRate,
                           unemploymentRate: element.unemploymentRate,
                           weeklyEarning: element.weeklyEarning,
                           employmentRatePercentage: percentage,
                           employmentRateTempRating: percentage*5
                       });
                   
                });
                
                employment_array=[];
                employment_array=temparray;// transfering all info into employment_array json
                var temparray=[];
                
                module.exports.sortResults(employment_array,"unemploymentRate",true); // sorting employment_array in ascending order according to unemployment rate
                var minUnemploymentRate=employment_array[0].unemploymentRate; // regional min unemployment rate
                
                var percentage=0;
                var temparray=[];
                employment_array.forEach(function(element){// calculating rating for unemployment
                       percentage= minUnemploymentRate/element.unemploymentRate;
                       //console.log("Region "+element.region+" percentage "+percentage);
                    
                       temparray.push({// pushing all data into temp array json
                           region: element.region,
                           employmentRate: element.employmentRate,
                           unemploymentRate: element.unemploymentRate,
                           weeklyEarning: element.weeklyEarning,
                           employmentRatePercentage: element.employmentRatePercentage,
                           employmentRateTempRating: element.employmentRateTempRating,
                           unemploymentRatePercentage: percentage,
                           unemploymentRateTempRating: percentage*5
                       });
                });
                
                employment_array=[];
                employment_array=temparray;// transfering all info into employment_array json
                temparray=[];
                
                module.exports.sortResults(employment_array,"weeklyEarning",false); // sorting in descending order acccording to weekly earning
                var maxWeeklyEarning=employment_array[0].weeklyEarning; // geting regional hight weekly earning figure
                
                percentage=0;
                temparray=[];
                employment_array.forEach(function(element){
                       percentage= element.weeklyEarning/maxWeeklyEarning;
                       //console.log("Region "+element.region+" percentage "+percentage);
                    
                       temparray.push({// pushing all data into temp array json
                           region: element.region,
                           employmentRate: element.employmentRate,
                           unemploymentRate: element.unemploymentRate,
                           weeklyEarning: element.weeklyEarning,
                           employmentRatePercentage: element.employmentRatePercentage,
                           employmentRateTempRating: element.employmentRateTempRating,
                           unemploymentRatePercentage: element.unemploymentRatePercentage,
                           unemploymentRateTempRating: element.unemploymentRateTempRating,
                           weeklyEarningPercentage: percentage,
                           weeklyEarningTempRating: percentage*5
                       });
                   
                });
                
                employment_array=[];
                employment_array=temparray;// transfering all info into employment_array json
                temparray=[];
                
                // for loop used to work out rating for each region regarding employment and the data is stored in employment_rating json
                for(var i=0; i<employment_array.length;i++){
                    
                    var averageRating= (employment_array[i].employmentRateTempRating+employment_array[i].unemploymentRateTempRating+employment_array[i].weeklyEarningTempRating)/3;
                        //console.log("region "+education_array[i].region+" grade rating: "+education_array[i].gradeTempRating+" below standard grade "+education_array[i].belowStandardTempRating);
                    
                        employment_rating.push(
                            {
                                region: employment_array[i].region,
                                rating: averageRating.toFixed(2)
                            }
                        )
                }
                module.exports.sortResults(employment_rating,"region",true);
                for(var i=0;i<employment_rating.length;i++){
                    //console.log("Region: "+employment_rating[i].region+" employment rating: "+employment_rating[i].rating);
                }
                
                return cb(employment_rating);
                        
                    });// end of end function
  },
  
getHousingRating: function(cb){
      var dataStore=[];
      var housing_array=[];
      var housing_rating=[];
    // getting data and working out rating for housing  
    path= fs.createReadStream("./public/data/cat/Housing_Meta.csv")
    csvStream= csv.fromStream(path,{headers: true}).on("data", function(d){
            dataStore.push( {
                            region : d["Regions"],
                            percentageChange : Number(d["12 Month Percentage Change"]),
                            averageHousePrice: Number(d["Average House Prices (GBP)"])});
                            
        
                    }).on("end", function(){
                        
                        for(var i=0; i<regions.length;i++){
                    
                            dataStore.forEach(function(d){
                                if(d.region==regions[i]){
                                    if(typeof(d.percentageChange)!='undefined' && typeof(d.averageHousePrice)!='undefined'){
                                        //console.log("Housing: Region: "+d.region+" Pecentage change: "+d.percentageChange+" average house price "+d.averageHousePrice);
                                        housing_array.push(
                                        {
                                            region: regions[i],
                                            percentageChange: d.percentageChange,
                                            averageHousePrice: d.averageHousePrice
                                        });
                                    }
                                }
                        
                            });
                        }
                        
                        module.exports.sortResults(housing_array,"percentageChange",true); // sorting housing_array in ascending order by percentage change
                        var minPercentageChange=housing_array[0].percentageChange;
                        
                        var percentage=0;
                        var temparray=[];
                        housing_array.forEach(function(element){
                            percentage= minPercentageChange/element.percentageChange;
                            //console.log("Region "+element.region+" percentage of percentage change "+percentage);
                    
                            temparray.push({// pushing all data into temp array json
                                region: element.region,
                                percentageChange: element.percentageChange,
                                averageHousePrice: element.averageHousePrice,
                                percentageChangePercentage: percentage,
                                percentageChangeTempRating: percentage*5
                            });
                   
                        });
                
                        housing_array=[];
                        housing_array=temparray;// transfering all info into housing_array json
                        
                        module.exports.sortResults(housing_array,"averageHousePrice",true); // sorting housing_array in ascending order by average house price
                        var minAverageHousePrice=housing_array[0].averageHousePrice;
                        
                        percentage=0;
                        temparray=[];
                        housing_array.forEach(function(element){
                            percentage= minAverageHousePrice/element.averageHousePrice;
                            //console.log("Region "+element.region+" percentage of average house price "+percentage);
                    
                            temparray.push({// pushing all data into temp array json
                                region: element.region,
                                percentageChange: element.percentageChange,
                                averageHousePrice: element.averageHousePrice,
                                percentageChangePercentage: element.percentageChangePercentage,
                                percentageChangeTempRating: element.percentageChangeTempRating,
                                averageHousePricePercentage: percentage,
                                averageHousePriceTempRating: percentage*5
                            });
                        });
                
                        housing_array=[];
                        housing_array=temparray;// transfering all info into housing_array json
                        temparray=[];
                        
                        // for loop used to work out rating for each region regarding employment and the data is stored in housing_rating json
                        for(var i=0; i<housing_array.length;i++){
                    
                            var averageRating= (housing_array[i].percentageChangeTempRating+housing_array[i].averageHousePriceTempRating)/2;
                            //console.log("region "+education_array[i].region+" grade rating: "+education_array[i].gradeTempRating+" below standard grade "+education_array[i].belowStandardTempRating);
                    
                            housing_rating.push(
                            {
                                region: housing_array[i].region,
                                rating: averageRating.toFixed(2)
                            });
                        }
                        module.exports.sortResults(housing_rating,"region",true);
                        for(var i=0;i<housing_rating.length;i++){
                            //console.log("Region: "+housing_rating[i].region+" housing rating: "+housing_rating[i].rating);
                        }
                        return cb(housing_rating);
                        
                    }); // end of end function  
  },
  
getPopulationRating: function(cb){
      var dataStore=[];
      var population_array=[];
      var population_rating=[];
    // getting data and working out rating for population   
    path= fs.createReadStream("./public/data/cat/Population_Meta.csv")
    csvStream= csv.fromStream(path,{headers: true}).on("data", function(d){
            dataStore.push( {
                            region : d["Regions"],
                            populationDensity: d["Population density"],
                            lifeExpectancy: Number(d["Average Life Expectancy"]),
                            crimeDensity: Number(d["Crime per 1000 people"])});
        
                    }).on("end", function(){
                        for(var i=0; i<regions.length;i++){
                    
                            dataStore.forEach(function(d){
                            
                                if(d.region==regions[i]){
                                    if(typeof(d.populationDensity)!='undefined' && typeof(d.lifeExpectancy)!='undefined' && typeof(d.crimeDensity)!='undefined'){
                                        //console.log("Population: Region: "+d.region+" population density: "+d.populationDensity+" life expectancy  "+d.lifeExpectancy+" crime density "+d.crimeDensity);
                            
                                        population_array.push(
                                        {
                                            region: regions[i],
                                            populationDensity: d.populationDensity,
                                            lifeExpectancy: d.lifeExpectancy,
                                            crimeDensity: d.crimeDensity
                                        });
                                    }
                                }
                        
                            });
                        }
                        
                        module.exports.sortResults(population_array,"populationDensity",true); // sorting population_array in ascending order by population density
                        var minPopulationDensity=population_array[0].populationDensity;
                        //console.log("min population density "+minPopulationDensity);
                        var percentage=0;
                        var temparray=[];
                        population_array.forEach(function(element){// calculating rating in regards to total population
                            percentage= minPopulationDensity/element.populationDensity;
                            //console.log("Region "+element.region+" percentage of population density "+percentage);
                    
                            temparray.push({// pushing all data into temp array json
                                region: element.region,
                                populationDensity: element.totalPopulation,
                                lifeExpectancy: element.lifeExpectancy,
                                crimeDensity: element.crimeDensity,
                                populationDensityPercentage: percentage,
                                populationDensityTempRating: percentage*5
                            });
                   
                        });
                        
                        population_array=[];
                        population_array=temparray;// transfering all info into population_array json
                        
                        module.exports.sortResults(population_array,"lifeExpectancy",false); // sorting population in descending order by life expectancy
                        var maxLifeExpectancy=population_array[0].lifeExpectancy;
                        
                        percentage=0;
                        temparray=[];
                        population_array.forEach(function(element){// calculating rating in regards to life expectancy
                            percentage= element.lifeExpectancy/maxLifeExpectancy;
                            //console.log("Region "+element.region+" percentage of life expectancy "+percentage);
                    
                            temparray.push({// pushing all data into temp array json
                                region: element.region,
                                populationDensity: element.populationDensity,
                                lifeExpectancy: element.lifeExpectancy,
                                crimeDensity: element.crimeDensity,
                                populationDensityPercentage: element.populationDensityPercentage,
                                populationDensityTempRating: element.populationDensityTempRating,
                                lifeExpectancyPercentage: percentage,
                                lifeExpectancyTempRating: percentage*5
                            });
                        });
                        
                        population_array=[];
                        population_array=temparray;// transfering all info into population_array json
                        module.exports.sortResults(population_array,"crimeDensity",true); // sorting population in ascending order by crime density 
                        
                         var minCrimeDensity=population_array[0].crimeDensity;// getting min crime density
                        //console.log("min unemployment rate "+minUnemploymentRate);
                        
                        percentage=0;
                        temparray=[];
                    population_array.forEach(function(element){
                        percentage= minCrimeDensity/element.crimeDensity;
                       //console.log("Region "+element.region+" percentage of crime density "+percentage);
                    
                       temparray.push({// pushing all data into temp array json
                           region: element.region,
                           populationDensity: element.populationDensity,
                           lifeExpectancy: element.lifeExpectancy,
                           crimeDensity: element.crimeDensity,
                           populationDensityPercentage: element.populationDensityPercentage,
                           populationDensityTempRating: element.populationDensityTempRating,
                           lifeExpectancyPercentage: element.lifeExpectancyPercentage,
                           lifeExpectancyTempRating: element.lifeExpectancyTempRating,
                           crimeDensityPercentage: percentage,
                           crimeDensityTempRating: percentage*5
                        });
                    });
                
                population_array=[];
                population_array=temparray;// transfering all info into population_array json
                
                // for loop used to work out rating for each region regarding employment and the data is stored in population_rating json
                for(var i=0; i<population_array.length;i++){
                    
                    var averageRating= (population_array[i].populationDensityTempRating+population_array[i].lifeExpectancyTempRating+population_array[i].crimeDensityTempRating)/3;
                        //console.log("region "+population_array[i].region+" grade rating: "+averageRating);
                    
                    if(averageRating>5){
                        population_rating.push(
                            {
                                region: population_array[i].region,
                                rating: Number(5.0)
                            }
                        );
                    }else{
                        population_rating.push(
                            {
                                region: population_array[i].region,
                                rating: Number(averageRating.toFixed(2))
                            }
                        );
                    }
                }
                module.exports.sortResults(population_rating,"region",true);
                for(var i=0;i<population_rating.length;i++){
                    //console.log("Region: "+population_rating[i].region+" population rating: "+population_rating[i].rating);
                }
                        return cb(population_rating);
                    });// end of end function
  },
  
  
      
getSocialRating: function(cb){
      var dataStore=[];
      var social_array=[];
      var social_rating=[];
    // getting data and working out rating for population   
    path= fs.createReadStream("./public/data/cat/Social_Meta.csv")
    csvStream= csv.fromStream(path,{headers: true}).on("data", function(d){
            dataStore.push( {
                            region : d["Regions"],
                            veryGood : Number(d["Very Healthy Population (%)"]),
                            good : Number(d["Healthy Population (%)"]),
                            fair : Number(d["Moderate Healthy Population (%)"]),
                            bad : Number(d["Unhealthy Population (%)"]),
                            veryBad : Number(d["Very Unhealthy Population (%)"])});
        
                    }).on("end", function(){
                for(var i=0; i<regions.length;i++){
                    
                    dataStore.forEach(function(d){
                        if(typeof(d.veryGood)!='undefined' && typeof(d.good)!='undefined' && typeof(d.fair)!='undefined' && typeof(d.bad)!='undefined' && typeof(d.veryBad)!='undefined'){
                        if(d.region==regions[i] ){
                            //console.log("social: Region: "+d.region+" very good: "+d.veryGood+" good "+d.good+" fair "+d.fair+" bad"+d.bad+" very bad "+d.veryBad);
                            social_array.push(
                                {
                                    region: regions[i],
                                    veryGood: d.veryGood,
                                    good: d.good,
                                    fair: d.fair,
                                    bad: d.bad,
                                    veryBad: d.veryBad
                                }
                            );
                            
                            if(d.veryGood>d.good && d.veryGood>d.fair && d.veryGood>d.bad && d.veryGood>d.veryBad){
                                //console.log("in very good");
                                social_rating.push(
                                    {
                                        region: regions[i],
                                        rating: (5.00).toFixed(2)
                                    }
                                );
                                
                            }
                            else if(d.good>d.veryGood && d.good>d.fair && d.good>d.bad && d.good>d.veryBad){
                                //console.log("in good");
                                social_rating.push(
                                    {
                                        region: regions[i],
                                        rating: (4.00).toFixed(2)
                                    }
                                );
                            }
                            else if(d.fair>d.veryGood && d.fair>d.good && d.fair>d.bad && d.fair>d.veryBad){
                                //console.log("in fair");
                                social_rating.push(
                                    {
                                        region: regions[i],
                                        rating: (3.00).toFixed(2)
                                    }
                                );
                            }
                            else if(d.bad>d.veryGood && d.bad>d.good && d.bad>d.fair && d.bad>d.veryBad){
                                //console.log("in bad");
                                social_rating.push(
                                    {
                                        region: regions[i],
                                        rating: (2.00).toFixed(2)
                                    }
                                );
                            }
                            else if(d.veryBad>d.veryGood && d.veryBad>d.good && d.veryBad>d.fair && d.veryBad>d.bad){
                                //console.log("in very bad");
                                social_rating.push(
                                    {
                                        region: regions[i],
                                        rating: (1.00).toFixed(2)
                                    }
                                );
                            }
                        }
                        }
                    });
                }
                module.exports.sortResults(social_rating,"region",true);
                for(var i=0;i<social_rating.length;i++){
                    //console.log("Region: "+social_rating[i].region+" social rating: "+social_rating[i].rating);
                }
                        //console.log(social_rating);
                        return cb(social_rating);
                    });// end of end function
                    
                    
                    
  },
 
  
getOverallRating: function(cb){
      
      module.exports.getSocialRating(function(socialRatingArray){
        module.exports.getPopulationRating(function(populationRatingArray){
            module.exports.getHousingRating(function(housingRatingArray){
                module.exports.getEmploymentRating(function(employmentRatingArray){
                    module.exports.getEducationRating(function(educationRatingArray){
                        module.exports.getEconomyRating(function(economyRatingArray){
                            module.exports.getCrimeRating(function(crimeRatingArray){
                                var overall_rating=[];
                                for(var i=0;i<regions.length;i++){
                                    
                                    //console.log("region crime: "+crimeRatingArray[i].region+" region economy: "+economyRatingArray[i].region+" region education: "+educationRatingArray[i].region+" region employment: "+employmentRatingArray[i].region+" region housing: "+housingRatingArray[i].region+" region population: "+populationRatingArray[i].region+" region social: "+socialRatingArray[i].region);
                                    
                                    var rating= (Number(crimeRatingArray[i].rating)+Number(economyRatingArray[i].rating)+Number(educationRatingArray[i].rating)+Number(employmentRatingArray[i].rating)+Number(housingRatingArray[i].rating)+Number(populationRatingArray[i].rating)+Number(socialRatingArray[i].rating))/7;
                                    //console.log(crimeRatingArray[i].rating+" "+economyRatingArray[i].rating+" "+educationRatingArray[i].rating+" "+employmentRatingArray[i].rating+" "+housingRatingArray[i].rating+" "+populationRatingArray[i].rating+" "+socialRatingArray[i].rating);
                                    //console.log(rating);
                                    overall_rating.push(
                                    {
                                        region: regions[i],
                                        rating: rating.toFixed(2)
                                    }
                                    );
                                }
                                
                                
                                return cb(overall_rating);
        
                            });
        
                        });
        
                    });

                });

            });

        });

    });
    
  },
 
    
getPreferenceRating: function(p1,p2,p3,cb){
        
        module.exports.getSocialRating(function(socialRatingArray){
            module.exports.getPopulationRating(function(populationRatingArray){
                module.exports.getHousingRating(function(housingRatingArray){
                    module.exports.getEmploymentRating(function(employmentRatingArray){
                        module.exports.getEducationRating(function(educationRatingArray){
                        module.exports.getEconomyRating(function(economyRatingArray){
                                module.exports.getCrimeRating(function(crimeRatingArray){
                                    if((p1==p2)||(p1==p3)||(p2==p3)){
          
                                        return cb(0);
                                    }
                                    else{
                                        var new_preference_rating=[];
                                        for(var i=0; i< regions.length;i++){
                                            var crimeRating=0;
                                            var economyRating=0;
                                            var educationRating=0;
                                            var employmentRating=0;
                                            var housingRating=0;
                                            var populationRating=0;
                                            var socialRating=0;
                                            
                                            // checking crime preference
                                            if(p1=="crime"){
                                                var crimeRating= (Number(crimeRatingArray[i].rating)*0.25);
                                            }
                                            else if(p2=="crime"){
                                                var crimeRating= (Number(crimeRatingArray[i].rating)*0.20);
                                            }
                                            else if(p3=="crime"){
                                                var crimeRating= (Number(crimeRatingArray[i].rating)*0.15);
                                            }
                                            else
                                            {
                                                var crimeRating= (Number(crimeRatingArray[i].rating)*0.10);
                                            }
                                            
                                            // checking economy preference
                                            if(p1=="economy"){
                                                var economyRating= (Number(economyRatingArray[i].rating)*0.25);
                                            }
                                            else if(p2=="economy"){
                                                var economyRating= (Number(economyRatingArray[i].rating)*0.20);
                                            }
                                            else if(p3=="economy"){
                                                var economyRating= (Number(economyRatingArray[i].rating)*0.15);
                                            }
                                            else
                                            {
                                                var economyRating= (Number(economyRatingArray[i].rating)*0.10);
                                            }
                                            
                                            // checking education preference
                                            if(p1=="education"){
                                                var educationRating= (Number(educationRatingArray[i].rating)*0.25);
                                            }
                                            else if(p2=="education"){
                                                var educationRating= (Number(educationRatingArray[i].rating)*0.20);
                                            }
                                            else if(p3=="education"){
                                                var educationRating= (Number(educationRatingArray[i].rating)*0.15);
                                            }
                                            else
                                            {
                                                var educationRating= (Number(educationRatingArray[i].rating)*0.10);
                                            }
                                            
                                            // checking employment preference
                                            if(p1=="employment"){
                                                var employmentRating= (Number(employmentRatingArray[i].rating)*0.25);
                                            }
                                            else if(p2=="employment"){
                                                var employmentRating= (Number(employmentRatingArray[i].rating)*0.20);
                                            }
                                            else if(p3=="employment"){
                                                var employmentRating= (Number(employmentRatingArray[i].rating)*0.15);
                                            }
                                            else
                                            {
                                                var employmentRating= (Number(employmentRatingArray[i].rating)*0.10);
                                            }
                                            
                                            // checking housing preference
                                            if(p1=="housing"){
                                                var housingRating= (Number(housingRatingArray[i].rating)*0.25);
                                            }
                                            else if(p2=="housing"){
                                                var housingRating= (Number(housingRatingArray[i].rating)*0.20);
                                            }
                                            else if(p3=="housing"){
                                                var housingRating= (Number(housingRatingArray[i].rating)*0.15);
                                            }
                                            else
                                            {
                                                var housingRating= (Number(housingRatingArray[i].rating)*0.10);
                                            }
                                            
                                            // checking population preference
                                            if(p1=="population"){
                                                var populationRating= (Number(populationRatingArray[i].rating)*0.25);
                                            }
                                            else if(p2=="population"){
                                                var populationRating= (Number(populationRatingArray[i].rating)*0.20);
                                            }
                                            else if(p3=="population"){
                                                var populationRating= (Number(populationRatingArray[i].rating)*0.15);
                                            }
                                            else
                                            {
                                                var populationRating= (Number(populationRatingArray[i].rating)*0.10);
                                            }
                                            
                                            // checking social preference
                                            if(p1=="social"){
                                                var socialRating= (Number(socialRatingArray[i].rating)*0.25);
                                            }
                                            else if(p2=="social"){
                                                var socialRating= (Number(socialRatingArray[i].rating)*0.20);
                                            }
                                            else if(p3=="social"){
                                                var socialRating= (Number(socialRatingArray[i].rating)*0.15);
                                            }
                                            else
                                            {
                                                var socialRating= (Number(socialRatingArray[i].rating)*0.10);
                                            }
                                            var rating= crimeRating+economyRating+educationRating+employmentRating+housingRating+populationRating+socialRating;
                                            
                                            new_preference_rating.push(
                                                    {
                                                    region: regions[i],
                                                    rating: rating.toFixed(2)
                                                    }
                                                );
                                                
                                                
                                        }
                                        return cb(new_preference_rating);
                                    }
        
                                });
        
                            });
        
                        });
    
                    });

                });

            });

        });
    }
    
    
}
/*/getPreferenceRating("crime","employment","education",function(final_rating){
        console.log(final_rating)
        
    });*/
    
/*/ getOverallRating(function(final_ratings){
console.log(final_ratings);
});*/
    