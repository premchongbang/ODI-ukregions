 var exports = module.exports = {};
 var d3 = require("d3");

            // array of all the regions
            var regions=["North East","North West","Yorkshire and the Humber","East Midlands","West Midlands","East of England","London","South East","South West","Wales","Scotland"];

            var category=["Crime","Economy","Education","Employment","Housing","Population","Social"];
                //create a two dimension array to store the id of the table
                var idname=[["NEcrime","NEeconomy","NEeducation","NEemployment","NEhouse","NEpopulation","NEsocial"],
["NWcrime","NWeconomy","NWeducation","NWemployment","NWhouse","NWpopulation","NWsocial"],
 ["YATHcrime","YATHeconomy","YATHeducation","YATHemployment","YATHhouse","YATHpopulation","YATHsocial"],
  ["EMcrime","EMeconomy","EMeducation","EMemployment","EMhouse","EMpopulation","EMsocial"],
 ["WMcrime","WMeconomy","WMeducation","WMemployment","WMhouse","WMpopulation","WMsocial"],
   ["EEcrime","EEeconomy","EEeducation","EEemployment","EEhouse","EEpopulation","EEsocial"],
    ["LDcrime","LDeconomy","LDeducation","LDemployment","LDhouse","LDpopulation","LDsocial"],
 ["SEcrime","SEeconomy","SEeducation","SEemployment","SEhouse","SEpopulation","SEsocial"],
      ["SWcrime","SWeconomy","SWeducation","SWemployment","SWhouse","SWpopulation","SWsocial"],
 ["WAcrime","WAeconomy","WAeducation","WAemployment","WAhouse","WApopulation","WAsocial"],
     ["SLcrime","SLeconomy","SLeducation","SLemployment","SLhouse","SLpopulation","SLsocial"] ];
           var new_ratingid=[["new_ratingname1","new_ratingvalue1"],["new_ratingname2","new_ratingvalue2"],["new_ratingname3","new_ratingvalue3"],["new_ratingname4","new_ratingvalue4"],["new_ratingname5","new_ratingvalue5"],["new_ratingname6","new_ratingvalue6"],["new_ratingname7","new_ratingvalue7"],["new_ratingname8","new_ratingvalue8"],["new_ratingname9","new_ratingvalue9"],["new_ratingname10","new_ratingvalue10"],["new_ratingname11","new_ratingvalue11"]]
            
            //array with population data of different regions
            var populationList=[];
            
            // arrays which will store data regarding different categories
            var crime_array=[];
            var economy_array=[];
            var education_array=[];
            var employment_array=[];
            var housing_array=[];
            var population_array=[];
            var social_array=[];
            
            // arrays which will soter data regarding different regions's rating for all categories
            var crime_rating=[];// e.g. North East 5
            var economy_rating=[];
            var education_rating=[];
            var employment_rating=[];
            var housing_rating=[];
            var population_rating=[];
            var social_rating=[];
            var new_rating=[];

            var crime_unsortrating=[];
            var economy_unsortrating=[];
            var education_unsortrating=[];
            var employment_unsortrating=[];
            var housing_unsortrating=[];
            var population_unsortrating=[];
            var social_unsortrating=[];
            

module.exports = {
    // finding the distane between two latitude and longitude point using Haversine formula
  getRegionalRating: function() {
      d3.csv("./data/cat2/Population_Meta.csv", function(d) {// getting population data from population csv
                return {
                    region : d["Region"],
                    population : Number(d["Population mid-20121 (Thousands)"])
                };
            }, function(data) {
                    // pushing region and population data into populationList json
                    for(var i=0; i<regions.length;i++){
                        data.forEach(function(d){
                            if(d.region==regions[i]){
                            populationList.push(
                        {
                            region: regions[i],
                            value: d.population
                        }
                                
                    );
                            }
                        })
                        
                  
                    //console.log("Region: "+populationList[i].region+" population: "+populationList[i].value);
                }
                
            });
            
            d3.csv("./data/cat2/Crime_Meta.csv", function(d) {// getting data regarding crime from crime_meta csv
                return {
                    region : d["Regions"],
                    totalCrime : Number(d["Total recorded crime (excluding fraud3)"])
                };
            }, function(data) {
                    var population=0;
                    var crimedensity=0;
                
                // adding up total crime in a area then using that, regional population data to calcuate crime density (total crime/ population) of each region.
                for(var i=0; i<regions.length;i++){
                    var totalRegionalCrime= 0;
                    
                    data.forEach(function(d){
                        if(d.region==regions[i]){
                            totalRegionalCrime += d.totalCrime;
                        }
                    });
                     
                    populationList.forEach(function(element){
                        if(element.region==regions[i]){
                        population= element.value;
                        crimedensity=totalRegionalCrime/population; // calculating crime density
                        }
                    });
                    //console.log("Region "+regions[i]+" population "+population+" crime density: "+crimedensity);
                  crime_array.push(// pushing all data into crime_array json
                        {
                            region: regions[i],
                            totalCrime: totalRegionalCrime,
                            crimeDensity: crimedensity
                        }
                    );
                    
                    }
                //console.log(crime_array);
                
               
                module.exports.sortResults(crime_array,"crimeDensity",true);// sorting crime_array json by crime density in ascending order
                
                //getting min crime density
                var minCrimeDensity=0;
                if(crime_array[0].crimeDensity==0){
                    minCrimeDensity= crime_array[1].crimeDensity;
                }
                else{
                    minCrimeDensity= crime_array[0].crimeDensity;
                }
                
                
                //console.log("min crime density "+minCrimeDensity);
                
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
              for(var i=0;i<crime_rating.length;i++){
                    console.log("Region: "+crime_rating[i].region+" crime rating: "+crime_rating[i].rating);
                }
                //console.log(crime_rating);
              //   for(var i=0;i<11;i++){
              //       for(var j=0;j<regions.length;j++){
              //       if(crime_rating[i].region==regions[j])
              //       {
                    
              // var tempid=idname[j][0];
            
              // $("#"+tempid).text(crime_rating[i].rating); 

              //       }
              //       }
          
              //   }


        for(var i=0;i<11;i++){
            for(var j=0;j<regions.length;j++){
              if(crime_rating[j].region==regions[i]) {
                  crime_unsortrating.push(
                        {region:regions[i],
                        rating:crime_rating[j].rating
                        }
                    ) 
                }
            }
        }
        //   for(var i=0;i<crime_unsortrating.length;i++){
        //       console.log("Region: "+crime_unsortrating[i].region+" crime rating: "+crime_unsortrating[i].rating);
        // }
                
            });
            
            d3.csv("./data/cat2/Economy_Meta.csv", function(d) {// getting data regarding economy from economy_meta csv
                return {
                    region : d["Region"],
                    totalGVA : Number(d["Gross Value Added at current basic price"]),
                    disposableIncome: Number(d["Gross disposable household income (per head)"]),
                    disposableIncomeIncrease: Number(d["Growth in gross disposable household income"])
                };
            }, function(data) {
                for(var i=0; i<regions.length;i++){
                    var totalgva= 0;
                    var totalDisposableIncome=0;
                    var totalDisposableIncomeIncrease=0;
                    var averageDisposableIncome=0;
                    var averageDisposableIncomeIncrease=0;
                    var counter=0;
                    
                    data.forEach(function(d){
                        if(d.region==regions[i]){
                            totalgva += d.totalGVA;
                            totalDisposableIncome += d.disposableIncome;
                            totalDisposableIncomeIncrease+= d.disposableIncomeIncrease;
                            counter++;
                        }
                    });
                    
                    averageDisposableIncome= totalDisposableIncome/counter;
                    averageDisposableIncomeIncrease= totalDisposableIncomeIncrease/counter;
                    
                  economy_array.push(
                        {
                            region: regions[i],
                            gva: totalgva,
                            disposableIncome: averageDisposableIncome,
                            disposableIncomeIncrease: averageDisposableIncomeIncrease
                        }
                    );
                    //console.log("Crime: Region: "+crime_array.map(function(d){return d.region})+" total: //"+crime_array.map(function(d){return d.value}));
                    
                   // console.log(economy_array[i].region +" "+economy_array[i].value );
                }
                
                module.exports.sortResults(economy_array,"gva",false); // sorting gva in dscending order
                //console.log(economy_array);
                
                var maxGVA=economy_array[0].gva;
                //console.log("max gva "+maxGVA);
                
                var percentage=0;
                var temparray=[];
                economy_array.forEach(function(element){
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
                economy_array=temparray;// transfering all info into crime_array json
                temparray=[];
                
                module.exports.sortResults(economy_array,"disposableIncome",false);// sorting disposable income in descending order
                var maxDI= economy_array[0].disposableIncome;// getting max disposable income
                
                economy_array.forEach(function(element){
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
                
                module.exports.sortResults(economy_array,"disposableIncomeIncrease",false);// sorting disposable income in descending order
                var maxDII= economy_array[0].disposableIncomeIncrease;// getting max disposable income
                //console.log("Max DII "+maxDII);
                
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
                    
                   // console.log("Region "+element.region+" Gva Rating "+element.gvaTempRating+" GI Rating "+element.giTempRating+" GII Rating "+Math.round(percentage*5));
                });
                
                economy_array=[];
                economy_array=temparray;// transfering all info into economy_array json
                temparray=[];
                
                
                // for loop used to work out rating for each region regarding economy and the data is stored in economy_rating json
                for(var i=0; i<economy_array.length;i++){
                    
                    if(economy_array[i].giiTempRating<0){
                        economy_rating.push(
                            {
                                region: economy_array[i].region,
                                rating: 1
                            }
                        )
                    }
                    else{
                        var averageRating= (economy_array[i].gvaTempRating+economy_array[i].giTempRating+economy_array[i].giiTempRating)/3;
                        economy_rating.push(
                            {
                                region: economy_array[i].region,
                                rating: averageRating.toFixed(2)
                            }
                        )
                    }
                }
                for(var i=0;i<economy_rating.length;i++){
                    console.log("Region: "+economy_rating[i].region+" economy rating: "+economy_rating[i].rating);
                }
               //console.log(economy_rating);
             // for(var i=0;i<11;i++){
             //        for(var j=0;j<regions.length;j++){
             //        if(economy_rating[i].region==regions[j])
             //        {
                    
             //  var tempid=idname[j][1];
             //  $("#"+tempid).text(economy_rating[i].rating); 

             //        }
             //        }
          
             //    }

        for(var i=0;i<11;i++){
            for(var j=0;j<regions.length;j++){
              if(economy_rating[j].region==regions[i]) {
                  economy_unsortrating.push(
                        {region:regions[i],
                        rating:economy_rating[j].rating
                        }
                    ) 
                }
            }
        }
                
        //    for(var i=0;i<economy_unsortrating.length;i++){
        //       console.log("Region: "+economy_unsortrating[i].region+" crime rating: "+economy_unsortrating[i].rating);
        // }       
            });
            
             d3.csv("./data/cat2/Education_Meta.csv", function(d) {
                return {
                    region : d["Region"],
                    girlGCSC : Number(d["Girls 5+ A*-C grades including maths and english"]),
                    boyGCSC : Number(d["Boys 5+ A*-C grades  including maths and english"]),
                    belowStandard : Number(d["Percentage of schools below the floor standard"])
                };
            }, function(data) {
                    
                for(var i=0; i<regions.length;i++){
                    var count=0;
                    var girlGCSCTotal=0;
                    var boyGCSCTotal=0;
                    var belowStandardTotal=0;
                    
                    var girlGCSCAverage=0;
                    var boyGCSCAverage=0;
                    var belowStandardAverage=0;
                    var overallAverage=0;
                    
                    data.forEach(function(d){
                        if(d.region==regions[i]){
                            girlGCSCTotal += d.girlGCSC;
                            boyGCSCTotal += d.boyGCSC;
                            belowStandardTotal += d.belowStandard;
                            count++;
                        }
                    });
                    
                    girlGCSCAverage= girlGCSCTotal/count;
                    boyGCSCAverage= boyGCSCTotal/count;
                    belowStandardAverage= belowStandardTotal/count;
                    
                    
                    overallAverage= (girlGCSCAverage+boyGCSCAverage)/2;
                    
                  education_array.push(
                        {
                            region: regions[i],
                            averageGrades: overallAverage,
                            belowStandard: belowStandardAverage
                        }
                    );
                    //console.log("Education: Region: "+education_array[i].region+" average grades: "+education_array[i].averageGrades+" below standard schools "+education_array[i].belowStandard);
                }
                
                module.exports.sortResults(education_array,"averageGrades",false);
                
                var maxGrade=education_array[0].averageGrades;
                //console.log("max gva "+maxGrade);
                
                
                var percentage=0;
                var temparray=[];
                education_array.forEach(function(element){
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
                education_array=temparray;// transfering all info into crime_array json
                temparray=[];
                 
                module.exports.sortResults(education_array,"belowStandard",true); // sorting education_array in ascending order
                
                var minBelowStandard=education_array[0].belowStandard;
                //console.log("min below standard "+minBelowStandard);
                
                
                var percentage=0;
                var temparray=[];
                education_array.forEach(function(element){
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
                education_array=temparray;// transfering all info into crime_array json
                temparray=[];
                
                 
                  // for loop used to work out rating for each region regarding education and the data is stored in education_rating json
                for(var i=0; i<education_array.length;i++){
                    
                    if(isNaN(parseFloat(education_array[i].gradeTempRating))|| isNaN(parseFloat(education_array[i].belowStandardTempRating))){
                       // console.log("region "+education_array[i].region+" grade rating: "+education_array[i].gradeTempRating+" below standard grade "+education_array[i].belowStandardTempRating);
                        education_rating.push(
                            {
                                region: education_array[i].region,
                                rating: 0
                            }
                        )
                    }
                    else{
                        var averageRating= (education_array[i].gradeTempRating+education_array[i].belowStandardTempRating)/2;
                        //console.log("region "+education_array[i].region+" grade rating: "+education_array[i].gradeTempRating+" below standard grade "+education_array[i].belowStandardTempRating);
                       // console.log("region "+education
                        education_rating.push(
                            {
                                region: education_array[i].region,
                                rating: averageRating.toFixed(2)
                            }
                        )
                    }
                }
              for(var i=0;i<education_rating.length;i++){
                    console.log("Region: "+education_rating[i].region+" education rating: "+education_rating[i].rating);
                }
               //console.log(education_rating);
             // for(var i=0;i<11;i++){
             //        for(var j=0;j<regions.length;j++){
             //        if(education_rating[i].region==regions[j])
             //        {
                    
             //  var tempid=idname[j][2];
             //  $("#"+tempid).text(education_rating[i].rating); 

             //        }
             //        }
          
             //    }


         for(var i=0;i<11;i++){
            for(var j=0;j<regions.length;j++){
              if(education_rating[j].region==regions[i]) {
                  education_unsortrating.push(
                        {region:regions[i],
                        rating:education_rating[j].rating
                        }
                    ) 
                }
            }
        }
        //             for(var i=0;i<education_unsortrating.length;i++){
        //       console.log("Region: "+education_unsortrating[i].region+" crime rating: "+education_unsortrating[i].rating);
        // }      
            });
            
            d3.csv("./data/cat2/Employment.csv", function(d) {
                return {
                    region : d["region"],
                    employmentRate : Number(d["employment rate"]),
                    unemploymentRate : Number(d["unemployment rate"]),
                    weeklyEarning : Number(d["Median gross weekly earnings"])
                };
            }, function(data) {

                for(var i=0; i<regions.length;i++){

                    data.forEach(function(d){
                      console.log("e rate " +  d.employmentRate + " regions " + d.region );
                        if(d.region==regions[i]){
                            //console.log("Employment: Region: "+d.region+" employment rate: "+d.employmentRate+" unemployment rate "+d.unemploymentRate+" weekly earning "+d.weeklyEarning);
                            employment_array.push(
                                {
                                    region: regions[i],
                                    employmentRate: d.employmentRate,
                                    unemploymentRate: d.unemploymentRate,
                                    weeklyEarning: d.weeklyEarning
                                }
                            );
                        }
                    });
                }
                
                console.log("size " + employment_array.length);
                module.exports.sortResults(employment_array,"employmentRate",false); // sorting in descending order
                
                var maxEmploymentRate=employment_array[0].employmentRate;
                //console.log("max employment rate "+maxEmploymentRate);
                
                var percentage=0;
                var temparray=[];
                employment_array.forEach(function(element){
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
                employment_array=temparray;// transfering all info into crime_array json
                var temparray=[];
                 
                module.exports.sortResults(employment_array,"unemploymentRate",true); // sorting employment_array in ascending order
                
                var minUnemploymentRate=employment_array[0].unemploymentRate;
                //console.log("min unemployment rate "+minUnemploymentRate);
                
                
                var percentage=0;
                var temparray=[];
                employment_array.forEach(function(element){
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
                employment_array=temparray;// transfering all info into crime_array json
                temparray=[];
                
                
                module.exports.sortResults(employment_array,"weeklyEarning",false); // sorting in descending order
                
                var maxWeeklyEarning=employment_array[0].weeklyEarning;
                //console.log("max weekly earning "+maxWeeklyEarning);
                
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
                employment_array=temparray;// transfering all info into crime_array json
                temparray=[];
                
                 
                  // for loop used to work out rating for each region regarding employment and the data is stored in employment_rating json
                for(var i=0; i<education_array.length;i++){
                    
                    var averageRating= (employment_array[i].employmentRateTempRating+employment_array[i].unemploymentRateTempRating+employment_array[i].weeklyEarningTempRating)/3;
                        //console.log("region "+education_array[i].region+" grade rating: "+education_array[i].gradeTempRating+" below standard grade "+education_array[i].belowStandardTempRating);
                    
                        employment_rating.push(
                            {
                                region: employment_array[i].region,
                                rating: averageRating.toFixed(2)
                            }
                        )
                }
                
             for(var i=0;i<employment_rating.length;i++){
                    console.log("Region: "+employment_rating[i].region+" employment rating: "+employment_rating[i].rating);
                }
               //console.log(employment_rating);
             // for(var i=0;i<11;i++){
             //        for(var j=0;j<regions.length;j++){
             //        if(employment_rating[i].region==regions[j])
             //        {
                    
             //  var tempid=idname[j][3];
             //  $("#"+tempid).text(employment_rating[i].rating); 

             //        }
             //        }
          
             //    }



         for(var i=0;i<11;i++){
            for(var j=0;j<regions.length;j++){
              if(employment_rating[j].region==regions[i]) {
                  employment_unsortrating.push(
                        {region:regions[i],
                        rating:employment_rating[j].rating
                        }
                    ) 
                }
            }
        }

        //           for(var i=0;i<employment_unsortrating.length;i++){
        //       console.log("Region: "+employment_unsortrating[i].region+" crime rating: "+employment_unsortrating[i].rating);
        // }
                
            });   
            
            d3.csv("./data/cat2/Housing_Meta.csv", function(d) {
                return {
                    region : d["Region"],
                    percentageChange : Number(d["12 month percentage change"]),
                    averageHousePrice: Number(d["Average house prices"])
                };
            }, function(data) {
                    
                for(var i=0; i<regions.length;i++){
                    
                    data.forEach(function(d){
                        if(d.region==regions[i]){
                            //console.log("Housing: Region: "+d.region+" Pecentage change: "+d.percentageChange+" average house price "+d.averageHousePrice);
                            housing_array.push(
                                {
                                    region: regions[i],
                                    percentageChange: d.percentageChange,
                                    averageHousePrice: d.averageHousePrice
                                }
                            );
                        }
                    });
                }
                
                module.exports.sortResults(housing_array,"percentageChange",true); // sorting housing_array in ascending order by percentage change
                
                var minPercentageChange=housing_array[0].percentageChange;
                //console.log("max employment rate "+maxEmploymentRate);
                
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
                housing_array=temparray;// transfering all info into crime_array json
                 
                module.exports.sortResults(housing_array,"averageHousePrice",true); // sorting housing_array in ascending order by average house price
                
                var minAverageHousePrice=housing_array[0].averageHousePrice;
                //console.log("min unemployment rate "+minUnemploymentRate);
                
                
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
                housing_array=temparray;// transfering all info into crime_array json
                temparray=[];
                
                
                
                 
                  // for loop used to work out rating for each region regarding employment and the data is stored in housing_rating json
                for(var i=0; i<housing_array.length;i++){
                    
                    var averageRating= (housing_array[i].percentageChangeTempRating+housing_array[i].averageHousePriceTempRating)/2;
                        //console.log("region "+education_array[i].region+" grade rating: "+education_array[i].gradeTempRating+" below standard grade "+education_array[i].belowStandardTempRating);
                    
                        housing_rating.push(
                            {
                                region: housing_array[i].region,
                                rating: averageRating.toFixed(2)
                            }
                        )
                }
                
             for(var i=0;i<housing_rating.length;i++){
                    console.log("Region: "+housing_rating[i].region+" housing rating: "+housing_rating[i].rating);
                }
               //console.log(employment_rating);
            // for(var i=0;i<11;i++){
            //         for(var j=0;j<regions.length;j++){
            //         if(housing_rating[i].region==regions[j])
            //         {
                    
            //   var tempid=idname[j][4];
            //   $("#"+tempid).text(housing_rating[i].rating); 

            //         }
            //         }
          
            //     }

        for(var i=0;i<11;i++){
            for(var j=0;j<regions.length;j++){
              if(housing_rating[j].region==regions[i]) {
                  housing_unsortrating.push(
                        {region:regions[i],
                        rating:housing_rating[j].rating
                        }
                    ) 
                }
            }
        }

        //               for(var i=0;i<housing_unsortrating.length;i++){
        //       console.log("Region: "+housing_unsortrating[i].region+" crime rating: "+housing_unsortrating[i].rating);
        // }    
            });
            
            d3.csv("./data/cat2/Population_Meta.csv", function(d) {
                return {
                    region : d["Region"],
                    populationDensity : Number(d["Population density mid-20121 (People per sq km)"]),
                    lifeExpectancy: Number(d["Average life expectancy"]),
                    crimeDensity: Number(d["Crime per 1000 people"])
                };
            }, function(data) {
                    
                for(var i=0; i<regions.length;i++){
                    
                    data.forEach(function(d){
                        if(d.region==regions[i]){
                            //console.log("Population: Region: "+d.region+" Population density: "+d.populationDensity+" life expectancy  "+d.lifeExpectancy+" crime density "+d.crimeDensity);
                            
                            population_array.push(
                                {
                                    region: regions[i],
                                    populationDensity: d.populationDensity,
                                    lifeExpectancy: d.lifeExpectancy,
                                    crimeDensity: d.crimeDensity
                                }
                            );
                        }
                    });
                }
                
                module.exports.sortResults(population_array,"populationDensity",true); // sorting population_array in ascending order by population density
                
                var minPopulationDensity=population_array[0].populationDensity;
                //console.log("max employment rate "+maxEmploymentRate);
                
                var percentage=0;
                var temparray=[];
                population_array.forEach(function(element){
                       percentage= minPopulationDensity/element.populationDensity;
                       //console.log("Region "+element.region+" percentage of population density "+percentage);
                    
                       temparray.push({// pushing all data into temp array json
                           region: element.region,
                           populationDensity: element.populationDensity,
                           lifeExpectancy: element.lifeExpectancy,
                           crimeDensity: element.crimeDensity,
                           populationDensityPercentage: percentage,
                           populationDensityTempRating: percentage*5
                       });
                   
                });
                
                population_array=[];
                population_array=temparray;// transfering all info into crime_array json
                 
                module.exports.sortResults(population_array,"lifeExpectancy",false); // sorting population in descending order by life expectancy
                
                var maxLifeExpectancy=population_array[0].lifeExpectancy;
                //console.log("min unemployment rate "+minUnemploymentRate);
                
                
                percentage=0;
                temparray=[];
                population_array.forEach(function(element){
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
                
                var minCrimeDensity=population_array[0].crimeDensity;
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
                
                 
                  // for loop used to work out rating for each region regarding employment and the data is stored in housing_rating json
                for(var i=0; i<population_array.length;i++){
                    
                    var averageRating= (population_array[i].populationDensityTempRating+population_array[i].lifeExpectancyTempRating+population_array[i].crimeDensityTempRating)/3;
                        //console.log("region "+population_array[i].region+" grade rating: "+averageRating);
                    
                        population_rating.push(
                            {
                                region: population_array[i].region,
                                rating: averageRating.toFixed(2)
                            }
                        )
                }
                
             for(var i=0;i<population_rating.length;i++){
                    console.log("Region: "+population_rating[i].region+" population rating: "+population_rating[i].rating);
                }
               //console.log(population_array);
           // for(var i=0;i<11;i++){
           //          for(var j=0;j<regions.length;j++){
           //          if(population_rating[i].region==regions[j])
           //          {
                    
           //    var tempid=idname[j][5];
           //    $("#"+tempid).text(population_rating[i].rating); 

           //          }
           //          }
          
           //      }

        for(var i=0;i<11;i++){
            for(var j=0;j<regions.length;j++){
              if(population_rating[j].region==regions[i]) {
                  population_unsortrating.push(
                        {region:regions[i],
                        rating:population_rating[j].rating
                        }
                    ) 
                }
            }
        }
           
        //   for(var i=0;i<population_unsortrating.length;i++){
        //       console.log("Region: "+population_unsortrating[i].region+" crime rating: "+population_unsortrating[i].rating);
        // }

            }); 
            
            d3.csv("./data/cat2/Social_Meta.csv", function(d) {
                return {
                    region : d["Regions"],
                    veryGood : Number(d["Very good"]),
                    good : Number(d["Good"]),
                    fair : Number(d["Fair"]),
                    bad : Number(d["Bad"]),
                    veryBad : Number(d["Very bad"])
                };
            }, function(data) {
                    
                
             for(var i=0; i<regions.length;i++){
                    
                    data.forEach(function(d){
                        if(d.region==regions[i]){
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
                                        rating: 5.00
                                    }
                                );
                                
                            }
                            else if(d.good>d.veryGood && d.good>d.fair && d.good>d.bad && d.good>d.veryBad){
                                //console.log("in good");
                                social_rating.push(
                                    {
                                        region: regions[i],
                                        rating: 4.00
                                    }
                                );
                            }
                            else if(d.fair>d.veryGood && d.fair>d.good && d.fair>d.bad && d.fair>d.veryBad){
                                //console.log("in fair");
                                social_rating.push(
                                    {
                                        region: regions[i],
                                        rating: 3.00
                                    }
                                );
                            }
                            else if(d.bad>d.veryGood && d.bad>d.good && d.bad>d.fair && d.bad>d.veryBad){
                                //console.log("in bad");
                                social_rating.push(
                                    {
                                        region: regions[i],
                                        rating: 2.00
                                    }
                                );
                            }
                            else if(d.veryBad>d.veryGood && d.veryBad>d.good && d.veryBad>d.fair && d.veryBad>d.bad){
                                //console.log("in very bad");
                                social_rating.push(
                                    {
                                        region: regions[i],
                                        rating: 1.00
                                    }
                                );
                            }
                        }
                    });
                }
                
                for(var i=0;i<social_rating.length;i++){
                    console.log("Region: "+social_rating[i].region+" social rating: "+social_rating[i].rating);
                }
               //console.log(population_array);

              //       for(var i=0;i<11;i++){
              //       for(var j=0;j<regions.length;j++){
              //       if(social_rating[i].region==regions[j])
              //       {
                    
              // var tempid=idname[j][6];
              // $("#"+tempid).text(social_rating[i].rating); 

              //       }
              //       }
          
              //   }

        for(var i=0;i<11;i++){
            for(var j=0;j<regions.length;j++){
              if(social_rating[j].region==regions[i]) {
                  social_unsortrating.push(
                        {region:regions[i],
                        rating:social_rating[j].rating
                        }
                    ) 
                }
            }
        }

        //           for(var i=0;i<social_unsortrating.length;i++){
        //       console.log("Region: "+social_unsortrating[i].region+" crime rating: "+social_unsortrating[i].rating);
        // }
                
            }); 


             new_rating.push(
                        {region:"North East",  rating:0},{region:"North West",rating:0},{region:"Yorkshire and the Humber",rating:0},{region:"East Midlands",rating:0},{region:"West Midlands",rating:0},{region:"East of England",rating:0},{region:"London",rating:0},{region:"South East",rating:0},{region:"South West",rating:0},{region:"Wales",rating:0},{region:"Scotland",rating:0}
                    );
      return null;
  },
  getPreferenceRating: function(p1, p2, p3) {
  for(var i=0;i<11;i++){
            new_rating[i].rating=0;

        }

      //alert($("#region2").val());
      //var region=$("#region").val();
      //preference 1
      var p1=$("#p1").val();
      //preference 2
      var p2=$("#p2").val();
      //preference 3
      var p3=$("#p3").val();
    // if two of the preference are same ,return. and dont do anything
      if((p1==p2)||(p1==p3)||(p2==p3)){
       alert("please enter the different preference");      
        return;
}

    //  var crime1=idname[10][0];
    //   $("#"+crime1).text(1); 
    // var crime2=idname[10][2];
    //   $("#"+crime2).text(1); 
    // var education=idname[9][2];
    //   $("#"+education).text(1); 


    //calculate the new rating according to the preference
  if(p1=="Crime"){
    for(var j=0;j<11;j++){

        var temp=crime_unsortrating[j].rating;
    //var idntifiy=idname[j][0];
    //preference 1 occupy 25%
  new_rating[j].rating=parseFloat(new_rating[j].rating)+parseFloat(temp)*0.25;
     }
     }
  if(p1=="Economy"){
   for(var j=0;j<11;j++){
    var temp=economy_unsortrating[j].rating;
  new_rating[j].rating=parseFloat(new_rating[j].rating)+parseFloat(temp)*0.25;
     }
  }
   if(p1=="Education"){ 
  for(var j=0;j<11;j++){
   var temp=education_unsortrating[j].rating;
  new_rating[j].rating=parseFloat(new_rating[j].rating)+parseFloat(temp)*0.25;
     }
   }
    
   if(p1=="Employment"){ 
  for(var j=0;j<11;j++){
      var temp=employment_unsortrating[j].rating;
  new_rating[j].rating=parseFloat(new_rating[j].rating)+parseFloat(temp)*0.25;
     }
   }


   if(p1=="Housing"){
 for(var j=0;j<11;j++){
     var temp=housing_unsortrating[j].rating;
  new_rating[j].rating=parseFloat(new_rating[j].rating)+parseFloat(temp)*0.25;
     }
   }
   
    if(p1=="Social"){
         for(var j=0;j<11;j++){
    var temp=social_unsortrating[j].rating;
  new_rating[j].rating=parseFloat(new_rating[j].rating)+parseFloat(temp)*0.25;
     }
    }
    if(p1=="Population"){
         for(var j=0;j<11;j++){
      var temp=population_unsortrating[j].rating;
  new_rating[j].rating=parseFloat(new_rating[j].rating)+parseFloat(temp)*0.25;
     }
    }


//preference 2 occupy 20%
      if(p2=="Crime"){
    for(var j=0;j<11;j++){
      var temp=crime_unsortrating[j].rating;
    //var idntifiy=idname[j][0];
    //preference 1 occupy 25%
  new_rating[j].rating=parseFloat(new_rating[j].rating)+parseFloat(temp)*0.2;
  //document.getElementById(idntifiy).value=new_rating[j].value;
        }
     }
  if(p2=="Economy"){
  for(var j=0;j<11;j++){
    var temp=economy_unsortrating[j].rating;
  new_rating[j].rating=parseFloat(new_rating[j].rating)+parseFloat(temp)*0.2;
     }
  }
   if(p2=="Education"){ 
for(var j=0;j<11;j++){
   var temp=education_unsortrating[j].rating;
  new_rating[j].rating=parseFloat(new_rating[j].rating)+parseFloat(temp)*0.2;
     }
   }
    
   if(p2=="Employment"){ 
 for(var j=0;j<11;j++){
      var temp=employment_unsortrating[j].rating;
  new_rating[j].rating=parseFloat(new_rating[j].rating)+parseFloat(temp)*0.2;
     }
   }


   if(p2=="Housing"){
for(var j=0;j<11;j++){
     var temp=housing_unsortrating[j].rating;
  new_rating[j].rating=parseFloat(new_rating[j].rating)+parseFloat(temp)*0.2;
     }
   }
   
    if(p2=="Social"){
        for(var j=0;j<11;j++){
    var temp=social_unsortrating[j].rating;
  new_rating[j].rating=parseFloat(new_rating[j].rating)+parseFloat(temp)*0.2;
     }
    }
    if(p2=="Population"){
     for(var j=0;j<11;j++){
      var temp=population_unsortrating[j].rating;
  new_rating[j].rating=parseFloat(new_rating[j].rating)+parseFloat(temp)*0.2;
     }    }

    //preference 1 occupy 15%
      if(p3=="Crime"){
 for(var j=0;j<11;j++){
      var temp=crime_unsortrating[j].rating;
    //var idntifiy=idname[j][0];
    //preference 1 occupy 25%
  new_rating[j].rating=parseFloat(new_rating[j].rating)+parseFloat(temp)*0.15;
  //document.getElementById(idntifiy).value=new_rating[j].value;
        }
     }
  if(p3=="Economy"){
  for(var j=0;j<11;j++){
    var temp=economy_unsortrating[j].rating;
  new_rating[j].rating=parseFloat(new_rating[j].rating)+parseFloat(temp)*0.15;
     }
  }
   if(p3=="Education"){ 
for(var j=0;j<11;j++){
   var temp=education_unsortrating[j].rating;
  new_rating[j].rating=parseFloat(new_rating[j].rating)+parseFloat(temp)*0.15;
     }
   }
    
   if(p3=="Employment"){ 
  for(var j=0;j<11;j++){
      var temp=employment_unsortrating[j].rating;
  new_rating[j].rating=parseFloat(new_rating[j].rating)+parseFloat(temp)*0.15;
     }
   }


   if(p3=="Housing"){
 for(var j=0;j<11;j++){
     var temp=housing_unsortrating[j].rating;
  new_rating[j].rating=parseFloat(new_rating[j].rating)+parseFloat(temp)*0.15;
     }
   }
   
    if(p3=="Social"){
       for(var j=0;j<11;j++){
    var temp=social_unsortrating[j].rating;
  new_rating[j].rating=parseFloat(new_rating[j].rating)+parseFloat(temp)*0.15;
     }
    }
    if(p3=="Population"){
            for(var j=0;j<11;j++){
      var temp=population_unsortrating[j].rating;
  new_rating[j].rating=parseFloat(new_rating[j].rating)+parseFloat(temp)*0.15;
     }

    }
  // others occupy 10%
  for(var i=0;i<category.length;i++){
   if((category[i]!=p1)&&(category[i]!=p2)&&(category[i]!=p3)){
    if(category[i]=="Crime"){
 for(var j=0;j<11;j++){
      var temp=crime_unsortrating[j].rating;
    //var idntifiy=idname[j][0];
    //preference 1 occupy 25%
  new_rating[j].rating=parseFloat(new_rating[j].rating)+parseFloat(temp)*0.1;
  //document.getElementById(idntifiy).value=new_rating[j].value;
        }
     }
  if(category[i]=="Economy"){
  for(var j=0;j<11;j++){
    var temp=economy_unsortrating[j].rating;
  new_rating[j].rating=parseFloat(new_rating[j].rating)+parseFloat(temp)*0.1;
     }
  }
   if(category[i]=="Education"){ 
for(var j=0;j<11;j++){
   var temp=education_unsortrating[j].rating;
  new_rating[j].rating=parseFloat(new_rating[j].rating)+parseFloat(temp)*0.1;
     }
   }
    
   if(category[i]=="Employment"){ 
  for(var j=0;j<11;j++){
      var temp=employment_unsortrating[j].rating;
  new_rating[j].rating=parseFloat(new_rating[j].rating)+parseFloat(temp)*0.1;
     }
   }


   if(category[i]=="Housing"){
 for(var j=0;j<11;j++){
     var temp=housing_unsortrating[j].rating;
  new_rating[j].rating=parseFloat(new_rating[j].rating)+parseFloat(temp)*0.1;
     }
   }
   
    if(category[i]=="Social"){
       for(var j=0;j<11;j++){
    var temp=social_unsortrating[j].rating;
  new_rating[j].rating=parseFloat(new_rating[j].rating)+parseFloat(temp)*0.1;
     }
    }
    if(category[i]=="Population"){
            for(var j=0;j<11;j++){
      var temp=population_unsortrating[j].rating;
  new_rating[j].rating=parseFloat(new_rating[j].rating)+parseFloat(temp)*0.1;
     }

    }
   }
  }

  for(var i=0;i<new_rating.length;i++){
              console.log("Region: "+new_rating[i].region+" new rating: "+new_rating[i].rating);
        }

    

  //   for(var i=0;i<11;i++){
  // //var s ＝Math.round(new_rating[i].value);
  //  //console.log(s);
  // // new_rating[i].value=parseInt(s);
  //  }
//the new rating of 11 regions

 sortResults(new_rating,"rating",false);  
    return new_rating;
  },
  sortResults: function(myArray,prop, asc){
    return myArray = myArray.sort(function(a, b) {
            if (asc) {
                return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            } else {
                return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
            }
    });
  }
};