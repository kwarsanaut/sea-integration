package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	"github.com/gorilla/handlers"
)

// Data Models
type User struct {
	ID               string    `json:"id"`
	Name             string    `json:"name"`
	Email            string    `json:"email"`
	Phone            string    `json:"phone"`
	RegistrationDate time.Time `json:"registration_date"`
	Tier             string    `json:"tier"`
}

type ShopeeProfile struct {
	UserID               string          `json:"user_id"`
	TotalOrders          int             `json:"total_orders"`
	TotalSpent           int64           `json:"total_spent"`
	FavoriteCategories   []string        `json:"favorite_categories"`
	RecentPurchases      []Purchase      `json:"recent_purchases"`
	CartAbandonmentRate  float64         `json:"cart_abandonment_rate"`
	LastActive           time.Time       `json:"last_active"`
}

type Purchase struct {
	Item  string    `json:"item"`
	Price int64     `json:"price"`
	Date  time.Time `json:"date"`
}

type GarenaProfile struct {
	UserID              string    `json:"user_id"`
	GamesPlayed         []string  `json:"games_played"`
	TotalGameHours      int       `json:"total_game_hours"`
	MonthlySpend        int64     `json:"monthly_spend"`
	Rank                string    `json:"rank"`
	Achievements        []string  `json:"achievements"`
	LastSession         time.Time `json:"last_session"`
	SocialConnections   int       `json:"social_connections"`
	PreferredGameTime   string    `json:"preferred_game_time"`
}

type SeaMoneyProfile struct {
	UserID              string     `json:"user_id"`
	WalletBalance       int64      `json:"wallet_balance"`
	CreditScore         int        `json:"credit_score"`
	LoanHistory         []Loan     `json:"loan_history"`
	MonthlyTransactions int        `json:"monthly_transactions"`
	AvgTransaction      int64      `json:"avg_transaction"`
	SavingsBalance      int64      `json:"savings_balance"`
	InvestmentPortfolio int64      `json:"investment_portfolio"`
	LastTransaction     time.Time  `json:"last_transaction"`
}

type Loan struct {
	Amount int64     `json:"amount"`
	Status string    `json:"status"`
	Date   time.Time `json:"date"`
}

type UserInsight struct {
	UserID           string             `json:"user_id"`
	InsightType      string             `json:"insight_type"`
	Confidence       float64            `json:"confidence"`
	DataSources      []string           `json:"data_sources"`
	Recommendation   string             `json:"recommendation"`
	PotentialRevenue int64              `json:"potential_revenue"`
	CreatedAt        time.Time          `json:"created_at"`
}

type CrossPlatformAction struct {
	ActionID        string                 `json:"action_id"`
	TargetPlatforms []string               `json:"target_platforms"`
	ActionType      string                 `json:"action_type"`
	Parameters      map[string]interface{} `json:"parameters"`
	ExpectedOutcome string                 `json:"expected_outcome"`
	Priority        int                    `json:"priority"`
}

type UnifiedProfile struct {
	User            User            `json:"user"`
	ShopeeProfile   ShopeeProfile   `json:"shopee_profile"`
	GarenaProfile   GarenaProfile   `json:"garena_profile"`
	SeaMoneyProfile SeaMoneyProfile `json:"seamoney_profile"`
	ComputedInsights map[string]interface{} `json:"computed_insights"`
}

type APIResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
	Message string      `json:"message,omitempty"`
}

// Mock Data Storage (In production, this would be a database)
var mockUsers = map[string]User{
	"user_001": {
		ID:               "user_001",
		Name:             "Ahmad Rizki",
		Email:            "ahmad.rizki@email.com",
		Phone:            "+62812345678",
		RegistrationDate: time.Date(2023, 1, 15, 0, 0, 0, 0, time.UTC),
		Tier:             "gold",
	},
	"user_002": {
		ID:               "user_002",
		Name:             "Siti Nurhaliza",
		Email:            "siti.nur@email.com",
		Phone:            "+62856789012",
		RegistrationDate: time.Date(2022, 8, 20, 0, 0, 0, 0, time.UTC),
		Tier:             "platinum",
	},
	"user_003": {
		ID:               "user_003",
		Name:             "Budi Santoso",
		Email:            "budi.santoso@email.com",
		Phone:            "+62887654321",
		RegistrationDate: time.Date(2023, 6, 10, 0, 0, 0, 0, time.UTC),
		Tier:             "silver",
	},
}

var mockShopeeProfiles = map[string]ShopeeProfile{
	"user_001": {
		UserID:      "user_001",
		TotalOrders: 45,
		TotalSpent:  8500000,
		FavoriteCategories: []string{"Gaming", "Electronics", "Fashion"},
		RecentPurchases: []Purchase{
			{Item: "Gaming Mouse Razer", Price: 450000, Date: time.Date(2024, 8, 20, 0, 0, 0, 0, time.UTC)},
			{Item: "Mechanical Keyboard", Price: 800000, Date: time.Date(2024, 8, 15, 0, 0, 0, 0, time.UTC)},
			{Item: "Gaming Headset", Price: 350000, Date: time.Date(2024, 8, 10, 0, 0, 0, 0, time.UTC)},
		},
		CartAbandonmentRate: 0.15,
		LastActive:          time.Date(2024, 8, 26, 0, 0, 0, 0, time.UTC),
	},
	"user_002": {
		UserID:      "user_002",
		TotalOrders: 78,
		TotalSpent:  15200000,
		FavoriteCategories: []string{"Beauty", "Fashion", "Home"},
		RecentPurchases: []Purchase{
			{Item: "Skincare Set", Price: 280000, Date: time.Date(2024, 8, 25, 0, 0, 0, 0, time.UTC)},
			{Item: "Designer Handbag", Price: 1200000, Date: time.Date(2024, 8, 20, 0, 0, 0, 0, time.UTC)},
		},
		CartAbandonmentRate: 0.08,
		LastActive:          time.Date(2024, 8, 27, 0, 0, 0, 0, time.UTC),
	},
	"user_003": {
		UserID:      "user_003",
		TotalOrders: 12,
		TotalSpent:  2100000,
		FavoriteCategories: []string{"Books", "Sports", "Gaming"},
		RecentPurchases: []Purchase{
			{Item: "Programming Books", Price: 150000, Date: time.Date(2024, 8, 18, 0, 0, 0, 0, time.UTC)},
			{Item: "Gaming Controller", Price: 320000, Date: time.Date(2024, 8, 5, 0, 0, 0, 0, time.UTC)},
		},
		CartAbandonmentRate: 0.35,
		LastActive:          time.Date(2024, 8, 22, 0, 0, 0, 0, time.UTC),
	},
}

var mockGarenaProfiles = map[string]GarenaProfile{
	"user_001": {
		UserID:            "user_001",
		GamesPlayed:       []string{"Free Fire", "PUBG Mobile", "Arena of Valor"},
		TotalGameHours:    450,
		MonthlySpend:      200000,
		Rank:              "Diamond",
		Achievements:      []string{"Tournament Winner", "Veteran Player"},
		LastSession:       time.Date(2024, 8, 26, 0, 0, 0, 0, time.UTC),
		SocialConnections: 234,
		PreferredGameTime: "evening",
	},
	"user_002": {
		UserID:            "user_002",
		GamesPlayed:       []string{"Mobile Legends", "Free Fire"},
		TotalGameHours:    89,
		MonthlySpend:      50000,
		Rank:              "Gold",
		Achievements:      []string{"Team Player"},
		LastSession:       time.Date(2024, 8, 25, 0, 0, 0, 0, time.UTC),
		SocialConnections: 45,
		PreferredGameTime: "afternoon",
	},
	"user_003": {
		UserID:            "user_003",
		GamesPlayed:       []string{"PUBG Mobile", "Call of Duty Mobile"},
		TotalGameHours:    234,
		MonthlySpend:      150000,
		Rank:              "Platinum",
		Achievements:      []string{"Sharpshooter", "Rising Star"},
		LastSession:       time.Date(2024, 8, 27, 0, 0, 0, 0, time.UTC),
		SocialConnections: 156,
		PreferredGameTime: "night",
	},
}

var mockSeaMoneyProfiles = map[string]SeaMoneyProfile{
	"user_001": {
		UserID:        "user_001",
		WalletBalance: 850000,
		CreditScore:   750,
		LoanHistory: []Loan{
			{Amount: 2000000, Status: "paid", Date: time.Date(2024, 6, 15, 0, 0, 0, 0, time.UTC)},
			{Amount: 1500000, Status: "current", Date: time.Date(2024, 8, 1, 0, 0, 0, 0, time.UTC)},
		},
		MonthlyTransactions: 45,
		AvgTransaction:      95000,
		SavingsBalance:      5200000,
		InvestmentPortfolio: 3400000,
		LastTransaction:     time.Date(2024, 8, 26, 0, 0, 0, 0, time.UTC),
	},
	"user_002": {
		UserID:        "user_002",
		WalletBalance: 450000,
		CreditScore:   820,
		LoanHistory: []Loan{
			{Amount: 5000000, Status: "paid", Date: time.Date(2024, 3, 10, 0, 0, 0, 0, time.UTC)},
		},
		MonthlyTransactions: 67,
		AvgTransaction:      125000,
		SavingsBalance:      8900000,
		InvestmentPortfolio: 12000000,
		LastTransaction:     time.Date(2024, 8, 27, 0, 0, 0, 0, time.UTC),
	},
	"user_003": {
		UserID:              "user_003",
		WalletBalance:       125000,
		CreditScore:         680,
		LoanHistory:         []Loan{},
		MonthlyTransactions: 23,
		AvgTransaction:      67000,
		SavingsBalance:      780000,
		InvestmentPortfolio: 450000,
		LastTransaction:     time.Date(2024, 8, 20, 0, 0, 0, 0, time.UTC),
	},
}

// UIL Core Logic
func computeUserInsights(shopee ShopeeProfile, garena GarenaProfile, seamoney SeaMoneyProfile) map[string]interface{} {
	insights := make(map[string]interface{})

	// Calculate user value score (0-100)
	shopeeScore := float64(shopee.TotalSpent) / 100000 * 20    // Max 20 points
	garenaScore := float64(garena.MonthlySpend) / 10000 * 15   // Max 15 points
	seamoneyScore := float64(seamoney.CreditScore-600) / 10    // Max 25 points
	investmentScore := float64(seamoney.InvestmentPortfolio) / 1000000 * 40 // Max 40 points

	totalValueScore := shopeeScore + garenaScore + seamoneyScore + investmentScore
	if totalValueScore > 100 {
		totalValueScore = 100
	}

	insights["user_value_score"] = totalValueScore

	// Determine user segment
	var segment string
	if totalValueScore >= 80 {
		segment = "VIP"
	} else if totalValueScore >= 60 {
		segment = "High Value"
	} else if totalValueScore >= 30 {
		segment = "Regular"
	} else {
		segment = "New/Low Activity"
	}
	insights["user_segment"] = segment

	// Cross-platform behavior analysis
	gamingSpend := garena.MonthlySpend
	shoppingGamingItems := false
	for _, category := range shopee.FavoriteCategories {
		if category == "Gaming" {
			shoppingGamingItems = true
			break
		}
	}

	var persona, crossSellOpportunity string
	if gamingSpend > 100000 && shoppingGamingItems {
		persona = "Hardcore Gamer"
		crossSellOpportunity = "High - Gaming ecosystem"
	} else if seamoney.InvestmentPortfolio > 5000000 {
		persona = "Investor"
		crossSellOpportunity = "Medium - Financial products"
	} else {
		persona = "Casual User"
		crossSellOpportunity = "Low - Basic engagement"
	}

	insights["persona"] = persona
	insights["cross_sell_opportunity"] = crossSellOpportunity
	insights["churn_risk"] = "Low" // Simplified for demo

	// Revenue calculation
	currentMonthlyRevenue := float64(shopee.TotalSpent)/12 +
		float64(garena.MonthlySpend) +
		float64(seamoney.AvgTransaction)*float64(seamoney.MonthlyTransactions)*0.02

	insights["monthly_revenue_contribution"] = int64(currentMonthlyRevenue)

	return insights
}

func generateCrossPlatformInsights(userID string, profile UnifiedProfile) []UserInsight {
	var insights []UserInsight
	computedInsights := profile.ComputedInsights

	// Cross-sell opportunities for Hardcore Gamers
	if computedInsights["persona"] == "Hardcore Gamer" {
		insight := UserInsight{
			UserID:           userID,
			InsightType:      "cross_sell_gaming",
			Confidence:       0.85,
			DataSources:      []string{"shopee", "garena"},
			Recommendation:   "Recommend premium gaming accessories and exclusive in-game items",
			PotentialRevenue: 500000,
			CreatedAt:        time.Now(),
		}
		insights = append(insights, insight)
	}

	// VIP treatment for high-value users
	if computedInsights["user_segment"] == "VIP" {
		insight := UserInsight{
			UserID:           userID,
			InsightType:      "vip_treatment",
			Confidence:       0.90,
			DataSources:      []string{"shopee", "garena", "seamoney"},
			Recommendation:   "Activate VIP support, exclusive deals, and priority services",
			PotentialRevenue: 800000,
			CreatedAt:        time.Now(),
		}
		insights = append(insights, insight)
	}

	// Financial product cross-sell
	if profile.SeaMoneyProfile.CreditScore > 750 && profile.ShopeeProfile.TotalSpent > 5000000 {
		insight := UserInsight{
			UserID:           userID,
			InsightType:      "financial_cross_sell",
			Confidence:       0.80,
			DataSources:      []string{"shopee", "seamoney"},
			Recommendation:   "Offer premium credit card or investment products",
			PotentialRevenue: 1200000,
			CreatedAt:        time.Now(),
		}
		insights = append(insights, insight)
	}

	return insights
}

// API Handlers
func enableCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
}

func respondJSON(w http.ResponseWriter, statusCode int, data interface{}) {
	enableCORS(w)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(data)
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	response := APIResponse{
		Success: true,
		Message: "Sea Universal Integration Layer API is running",
		Data: map[string]interface{}{
			"version":   "1.0.0",
			"timestamp": time.Now(),
			"status":    "healthy",
		},
	}
	respondJSON(w, http.StatusOK, response)
}

func getUsersHandler(w http.ResponseWriter, r *http.Request) {
	var users []User
	for _, user := range mockUsers {
		users = append(users, user)
	}

	response := APIResponse{
		Success: true,
		Data:    users,
		Message: fmt.Sprintf("Retrieved %d users", len(users)),
	}
	respondJSON(w, http.StatusOK, response)
}

func getUnifiedProfileHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID := vars["userID"]

	user, userExists := mockUsers[userID]
	if !userExists {
		response := APIResponse{
			Success: false,
			Error:   "User not found",
		}
		respondJSON(w, http.StatusNotFound, response)
		return
	}

	shopeeProfile, _ := mockShopeeProfiles[userID]
	garenaProfile, _ := mockGarenaProfiles[userID]
	seamoneyProfile, _ := mockSeaMoneyProfiles[userID]

	computedInsights := computeUserInsights(shopeeProfile, garenaProfile, seamoneyProfile)

	unifiedProfile := UnifiedProfile{
		User:             user,
		ShopeeProfile:    shopeeProfile,
		GarenaProfile:    garenaProfile,
		SeaMoneyProfile:  seamoneyProfile,
		ComputedInsights: computedInsights,
	}

	response := APIResponse{
		Success: true,
		Data:    unifiedProfile,
		Message: "Unified profile retrieved successfully",
	}
	respondJSON(w, http.StatusOK, response)
}

func getInsightsHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID := vars["userID"]

	user, userExists := mockUsers[userID]
	if !userExists {
		response := APIResponse{
			Success: false,
			Error:   "User not found",
		}
		respondJSON(w, http.StatusNotFound, response)
		return
	}

	shopeeProfile, _ := mockShopeeProfiles[userID]
	garenaProfile, _ := mockGarenaProfiles[userID]
	seamoneyProfile, _ := mockSeaMoneyProfiles[userID]

	computedInsights := computeUserInsights(shopeeProfile, garenaProfile, seamoneyProfile)

	unifiedProfile := UnifiedProfile{
		User:             user,
		ShopeeProfile:    shopeeProfile,
		GarenaProfile:    garenaProfile,
		SeaMoneyProfile:  seamoneyProfile,
		ComputedInsights: computedInsights,
	}

	insights := generateCrossPlatformInsights(userID, unifiedProfile)

	response := APIResponse{
		Success: true,
		Data:    insights,
		Message: fmt.Sprintf("Generated %d insights for user %s", len(insights), userID),
	}
	respondJSON(w, http.StatusOK, response)
}

func executeActionsHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID := vars["userID"]

	// Simulate action execution
	actions := []CrossPlatformAction{
		{
			ActionID:        "action_" + userID + "_" + strconv.FormatInt(time.Now().Unix(), 10),
			TargetPlatforms: []string{"shopee", "garena"},
			ActionType:      "targeted_promotion",
			Parameters: map[string]interface{}{
				"shopee_action": map[string]interface{}{
					"show_gaming_deals":    true,
					"discount_percentage":  15,
					"categories":          []string{"Gaming Accessories", "PC Components"},
				},
				"garena_action": map[string]interface{}{
					"offer_premium_items": true,
					"bonus_points":        500,
					"exclusive_skins":     true,
				},
			},
			ExpectedOutcome: "15% increase in gaming-related purchases",
			Priority:        1,
		},
	}

	response := APIResponse{
		Success: true,
		Data:    actions,
		Message: fmt.Sprintf("Executed %d coordinated actions for user %s", len(actions), userID),
	}
	respondJSON(w, http.StatusOK, response)
}

func getAnalyticsHandler(w http.ResponseWriter, r *http.Request) {
	// Calculate aggregate analytics
	totalUsers := len(mockUsers)
	vipCount := 0
	totalRevenue := int64(0)

	for userID := range mockUsers {
		shopeeProfile, _ := mockShopeeProfiles[userID]
		garenaProfile, _ := mockGarenaProfiles[userID]
		seamoneyProfile, _ := mockSeaMoneyProfiles[userID]

		insights := computeUserInsights(shopeeProfile, garenaProfile, seamoneyProfile)
		
		if insights["user_segment"] == "VIP" {
			vipCount++
		}
		
		totalRevenue += insights["monthly_revenue_contribution"].(int64)
	}

	analytics := map[string]interface{}{
		"total_users":        totalUsers,
		"vip_users":         vipCount,
		"regular_users":     totalUsers - vipCount,
		"vip_percentage":    float64(vipCount) / float64(totalUsers) * 100,
		"total_monthly_revenue": totalRevenue,
		"avg_revenue_per_user":  totalRevenue / int64(totalUsers),
		"projected_annual_revenue": totalRevenue * 12,
		"last_updated":      time.Now(),
	}

	response := APIResponse{
		Success: true,
		Data:    analytics,
		Message: "Analytics data retrieved successfully",
	}
	respondJSON(w, http.StatusOK, response)
}

func main() {
	r := mux.NewRouter()

	// Enable CORS middleware
	corsOrigins := handlers.AllowedOrigins([]string{"*"})
	corsHeaders := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
	corsMethods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"})

	// API Routes
	api := r.PathPrefix("/api/v1").Subrouter()
	
	api.HandleFunc("/health", healthHandler).Methods("GET")
	api.HandleFunc("/users", getUsersHandler).Methods("GET")
	api.HandleFunc("/users/{userID}/profile", getUnifiedProfileHandler).Methods("GET")
	api.HandleFunc("/users/{userID}/insights", getInsightsHandler).Methods("GET")
	api.HandleFunc("/users/{userID}/actions", executeActionsHandler).Methods("POST")
	api.HandleFunc("/analytics", getAnalyticsHandler).Methods("GET")

	// Serve static files (for frontend)
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./frontend/build/")))

	fmt.Println("🚀 Sea Universal Integration Layer API Server")
	fmt.Println("🌐 Server running on http://localhost:8080")
	fmt.Println("📊 API endpoints available at /api/v1/")
	fmt.Println("🔥 Frontend dashboard at http://localhost:8080")
	
	log.Fatal(http.ListenAndServe(":8080", handlers.CORS(corsOrigins, corsHeaders, corsMethods)(r)))
}
