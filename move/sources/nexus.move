module nexus::nexus {
    use std::signer;
    use std::string::{Self, String};
    use aptos_framework::timestamp;

    /// Errors
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_INVALID_TIMESTAMP: u64 = 2;

    /// Structs
    struct UserProfile has key, store {
        username: String,
        created_at: u64,
        updated_at: u64,
    }

    /// Events
    struct ProfileCreatedEvent has drop, store {
        user: address,
        username: String,
        timestamp: u64,
    }

    struct ProfileUpdatedEvent has drop, store {
        user: address,
        username: String,
        timestamp: u64,
    }

    /// Functions
    public entry fun create_profile(account: &signer, username: String) {
        let user_address = signer::address_of(account);
        let current_timestamp = timestamp::now_seconds();

        // Create user profile
        let profile = UserProfile {
            username,
            created_at: current_timestamp,
            updated_at: current_timestamp,
        };

        // Store profile
        move_to(account, profile);

        // Emit event
        let event = ProfileCreatedEvent {
            user: user_address,
            username: string::utf8(b"Profile created"),
            timestamp: current_timestamp,
        };
        event::emit(event);
    }

    public entry fun update_profile(account: &signer, new_username: String) acquires UserProfile {
        let user_address = signer::address_of(account);
        let current_timestamp = timestamp::now_seconds();

        // Get existing profile
        let profile = borrow_global_mut<UserProfile>(user_address);
        
        // Update profile
        profile.username = new_username;
        profile.updated_at = current_timestamp;

        // Emit event
        let event = ProfileUpdatedEvent {
            user: user_address,
            username: string::utf8(b"Profile updated"),
            timestamp: current_timestamp,
        };
        event::emit(event);
    }

    /// View functions
    public fun get_profile(user_address: address): (String, u64, u64) acquires UserProfile {
        let profile = borrow_global<UserProfile>(user_address);
        (profile.username, profile.created_at, profile.updated_at)
    }
} 