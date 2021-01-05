const Utils =  {
    calculateAge: function (birthday) {
        var ageDifMs = Date.now() - birthday.getTime();
        var ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
};

function GetTableData(context) {
    let arr = GetPepopleRawArray();
    arr.forEach( o => {
        const birth = new Date(o.birthDate);
        o.birthYear = birth.getFullYear();
        o.age = Utils.calculateAge(birth);
	});
	if (context) {
		arr = arr.filter( o => 
			(o.age>=context.age.min) &&
			(o.age<=context.age.max) &&
			( context.states.size === 0 || context.states.has(o.state)) 
		);
	}
    arr.sort((a, b) => new Date(a.birthDate)-new Date(b.birthDate));
    return arr;
}

function GetStateDictionary() {
	const states = GetStatesRawData();
	const arr = GetPepopleRawArray();
	const prefixes = [...new Set(arr.map(item => item.state))].sort();
	return prefixes.map(item=>({key:item, value:states[item]}));
}

function GetPepopleRawArray() {
	return [{
		"name": "Addison Berger",
		"birthDate": "1986-01-28",
		"SSN": "236-40-2963",
		"address": "7456 Vermont Drive",
		"city": "Widen",
		"state": "WV",
		"postalCode": "25211",
		"phone": "(304) 328-4803",
		"email": "addisonbergeraqa@teleosaurs.xyz"
	}, {
		"name": "Eugene Gordon",
		"birthDate": "1963-01-15",
		"SSN": "531-55-5079",
		"address": "3961 Rumsey Court",
		"city": "Tacoma",
		"state": "WA",
		"postalCode": "98448",
		"phone": "(253) 247-2028",
		"email": "eugenegordonduK@teleosaurs.xyz"
	}, {
		"name": "Reed Meadows",
		"birthDate": "1990-10-31",
		"SSN": "151-52-7458",
		"address": "1770 Garvey Lane",
		"city": "Jersey City",
		"state": "NJ",
		"postalCode": "07302",
		"phone": "(201) 407-4120",
		"email": "reedmeadows6R7@teleosaurs.xyz"
	}, {
		"name": "Hassan Shaffer",
		"birthDate": "1958-01-28",
		"SSN": "172-28-1556",
		"address": "2490 Kimberly Drive",
		"city": "Conneautville",
		"state": "PA",
		"postalCode": "16406",
		"phone": "(814) 286-9601",
		"email": "hassanshafferhW3@teleosaurs.xyz"
	}, {
		"name": "Brittany Maynard",
		"birthDate": "1965-10-12",
		"SSN": "263-05-2582",
		"address": "5658 Sanford Drive",
		"city": "Clermont",
		"state": "FL",
		"postalCode": "34711",
		"phone": "(352) 280-8532",
		"email": "brittanymaynardKsG@teleosaurs.xyz"
	}, {
		"name": "Arthur Mccray",
		"birthDate": "1978-10-17",
		"SSN": "203-01-2301",
		"address": "5773 Grover Avenue",
		"city": "Prospect",
		"state": "PA",
		"postalCode": "16052",
		"phone": "(724) 271-2816",
		"email": "arthurmccray9R2@teleosaurs.xyz"
	}, {
		"name": "Ellie Wilder",
		"birthDate": "1971-09-02",
		"SSN": "402-22-9657",
		"address": "3233 Haines Avenue",
		"city": "Louisville",
		"state": "KY",
		"postalCode": "40219",
		"phone": "(502) 506-9792",
		"email": "elliewilderDDr@teleosaurs.xyz"
	}, {
		"name": "Randolph Franklin",
		"birthDate": "1962-04-23",
		"SSN": "577-47-3554",
		"address": "9860 Marshall Avenue",
		"city": "Washington",
		"state": "DC",
		"postalCode": "20548",
		"phone": "(202) 286-8696",
		"email": "randolphfranklin8Sp@teleosaurs.xyz"
	}, {
		"name": "Bronson Henry",
		"birthDate": "1985-08-17",
		"SSN": "658-18-2290",
		"address": "8302 102nd Street",
		"city": "State Park",
		"state": "SC",
		"postalCode": "29147",
		"phone": "(803) 604-6047",
		"email": "bronsonhenryJ4y@teleosaurs.xyz"
	}, {
		"name": "Johanna Stewart",
		"birthDate": "1978-08-06",
		"SSN": "088-07-1429",
		"address": "6358 Clarendon Boulevard",
		"city": "New York",
		"state": "NY",
		"postalCode": "10171",
		"phone": "(212) 309-9829",
		"email": "johannastewartbJT@teleosaurs.xyz"
	}, {
		"name": "Forrest Durham",
		"birthDate": "1978-07-07",
		"SSN": "551-63-0418",
		"address": "9818 Solidarity Avenue",
		"city": "Rio Dell",
		"state": "CA",
		"postalCode": "95562",
		"phone": "(707) 337-6016",
		"email": "forrestdurhamUcm@teleosaurs.xyz"
	}, {
		"name": "Kasey Phelps",
		"birthDate": "1990-08-02",
		"SSN": "317-46-5046",
		"address": "6166 Illinois Lane",
		"city": "Crane",
		"state": "IN",
		"postalCode": "47522",
		"phone": "(812) 482-5401",
		"email": "kaseyphelpsPfY@teleosaurs.xyz"
	}, {
		"name": "Baylee Warner",
		"birthDate": "1979-11-13",
		"SSN": "756-01-1655",
		"address": "9607 Arch Place",
		"city": "Cumberland City",
		"state": "TN",
		"postalCode": "37050",
		"phone": "(931) 312-7634",
		"email": "bayleewarnerEBn@teleosaurs.xyz"
	}, {
		"name": "Raven Chen",
		"birthDate": "1948-04-06",
		"SSN": "407-10-2319",
		"address": "8983 Delaware Way",
		"city": "Marion",
		"state": "KY",
		"postalCode": "42064",
		"phone": "(270) 304-6915",
		"email": "ravenchen6Cj@teleosaurs.xyz"
	}, {
		"name": "Alan Mendoza",
		"birthDate": "1988-04-01",
		"SSN": "185-18-4959",
		"address": "903 Serbian Drive",
		"city": "Munson",
		"state": "PA",
		"postalCode": "16860",
		"phone": "(814) 338-5678",
		"email": "alanmendozaCkP@teleosaurs.xyz"
	}, {
		"name": "German Joyner",
		"birthDate": "1966-08-22",
		"SSN": "335-42-2331",
		"address": "2708 Kolin Street",
		"city": "Peoria",
		"state": "IL",
		"postalCode": "61643",
		"phone": "(309) 493-9040",
		"email": "germanjoynerTve@teleosaurs.xyz"
	}, {
		"name": "Darrion Mcbride",
		"birthDate": "1956-07-09",
		"SSN": "013-94-9094",
		"address": "5590 89th Way",
		"city": "Littleton",
		"state": "MA",
		"postalCode": "01460",
		"phone": "(978) 339-8924",
		"email": "darrionmcbride3Zr@teleosaurs.xyz"
	}, {
		"name": "Micah Tillman",
		"birthDate": "1945-01-24",
		"SSN": "081-64-9872",
		"address": "8384 Agatite Street",
		"city": "Rockville Center",
		"state": "NY",
		"postalCode": "11592",
		"phone": "(516) 624-6110",
		"email": "micahtillmanaD2@teleosaurs.xyz"
	}, {
		"name": "Stewart Harper",
		"birthDate": "1961-07-07",
		"SSN": "426-81-9272",
		"address": "7769 Harvard Way",
		"city": "Sumrall",
		"state": "MS",
		"postalCode": "39482",
		"phone": "(601) 648-8456",
		"email": "stewartharperxFk@teleosaurs.xyz"
	}, {
		"name": "Ciara Stevens",
		"birthDate": "1948-03-27",
		"SSN": "311-84-0655",
		"address": "923 Oglesby Avenue",
		"city": "Seymour",
		"state": "IN",
		"postalCode": "47274",
		"phone": "(812) 625-9990",
		"email": "ciarastevenszGZ@teleosaurs.xyz"
	}, {
		"name": "Shaina Fitzgerald",
		"birthDate": "1988-03-08",
		"SSN": "175-12-0598",
		"address": "2532 Komensky Circle",
		"city": "Scranton",
		"state": "PA",
		"postalCode": "18510",
		"phone": "(570) 389-1127",
		"email": "shainafitzgeraldF84@teleosaurs.xyz"
	}, {
		"name": "Bradley Castillo",
		"birthDate": "1952-12-16",
		"SSN": "650-10-9934",
		"address": "5672 Kenwood Circle",
		"city": "Manassa",
		"state": "CO",
		"postalCode": "81141",
		"phone": "(719) 778-4190",
		"email": "bradleycastillo2vj@teleosaurs.xyz"
	}, {
		"name": "Grayson Carter",
		"birthDate": "1986-01-20",
		"SSN": "231-99-7821",
		"address": "9099 Lawler Place",
		"city": "Lynchburg",
		"state": "VA",
		"postalCode": "24505",
		"phone": "(434) 540-1334",
		"email": "graysoncartergmz@teleosaurs.xyz"
	}, {
		"name": "Lacie Lynn",
		"birthDate": "1954-06-18",
		"SSN": "434-84-2668",
		"address": "5960 Troy Avenue",
		"city": "Rougon",
		"state": "LA",
		"postalCode": "70773",
		"phone": "(225) 787-1315",
		"email": "lacielynnxxJ@teleosaurs.xyz"
	}, {
		"name": "Tiffani Harrell",
		"birthDate": "1974-05-14",
		"SSN": "483-82-4464",
		"address": "4064 Cullerton Court",
		"city": "Elliott",
		"state": "IA",
		"postalCode": "51532",
		"phone": "(712) 297-9142",
		"email": "tiffaniharrellYwT@teleosaurs.xyz"
	}, {
		"name": "Lindsay Woodard",
		"birthDate": "1948-04-16",
		"SSN": "009-70-1587",
		"address": "4167 Chicago Boulevard",
		"city": "North Hyde Park",
		"state": "VT",
		"postalCode": "05665",
		"phone": "(802) 483-5552",
		"email": "lindsaywoodard3Gn@teleosaurs.xyz"
	}];
}

function GetStatesRawData() {
	return {
		"AL": "Alabama",
		"AK": "Alaska",
		"AS": "American Samoa",
		"AZ": "Arizona",
		"AR": "Arkansas",
		"CA": "California",
		"CO": "Colorado",
		"CT": "Connecticut",
		"DE": "Delaware",
		"DC": "District Of Columbia",
		"FM": "Federated States Of Micronesia",
		"FL": "Florida",
		"GA": "Georgia",
		"GU": "Guam",
		"HI": "Hawaii",
		"ID": "Idaho",
		"IL": "Illinois",
		"IN": "Indiana",
		"IA": "Iowa",
		"KS": "Kansas",
		"KY": "Kentucky",
		"LA": "Louisiana",
		"ME": "Maine",
		"MH": "Marshall Islands",
		"MD": "Maryland",
		"MA": "Massachusetts",
		"MI": "Michigan",
		"MN": "Minnesota",
		"MS": "Mississippi",
		"MO": "Missouri",
		"MT": "Montana",
		"NE": "Nebraska",
		"NV": "Nevada",
		"NH": "New Hampshire",
		"NJ": "New Jersey",
		"NM": "New Mexico",
		"NY": "New York",
		"NC": "North Carolina",
		"ND": "North Dakota",
		"MP": "Northern Mariana Islands",
		"OH": "Ohio",
		"OK": "Oklahoma",
		"OR": "Oregon",
		"PW": "Palau",
		"PA": "Pennsylvania",
		"PR": "Puerto Rico",
		"RI": "Rhode Island",
		"SC": "South Carolina",
		"SD": "South Dakota",
		"TN": "Tennessee",
		"TX": "Texas",
		"UT": "Utah",
		"VT": "Vermont",
		"VI": "Virgin Islands",
		"VA": "Virginia",
		"WA": "Washington",
		"WV": "West Virginia",
		"WI": "Wisconsin",
		"WY": "Wyoming"
	};
}