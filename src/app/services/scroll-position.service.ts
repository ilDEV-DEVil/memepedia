import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ScrollPositionService {
    private scrollPositions = new Map<string, number>();
    private readonly STORAGE_KEY = 'meme-list-scroll-position';

    constructor() { }

    /**
     * Saves the current scroll position for a specific route
     */
    saveScrollPosition(route: string, position: number): void {
        this.scrollPositions.set(route, position);
        // Also save in sessionStorage for persistence during refresh
        try {
            sessionStorage.setItem(this.STORAGE_KEY, position.toString());
        } catch (e) {
            // Ignore storage errors (e.g. private mode)
            console.warn('Could not save scroll position to sessionStorage', e);
        }
    }

    /**
     * Retrieves the saved scroll position for a specific route
     */
    getScrollPosition(route: string): number | null {
        // Try from memory first
        const memoryPosition = this.scrollPositions.get(route);
        if (memoryPosition !== undefined) {
            return memoryPosition;
        }

        // Fallback to sessionStorage
        try {
            const storedPosition = sessionStorage.getItem(this.STORAGE_KEY);
            if (storedPosition) {
                return parseInt(storedPosition, 10);
            }
        } catch (e) {
            console.warn('Could not read scroll position from sessionStorage', e);
        }

        return null;
    }

    /**
     * Clears the saved scroll position for a specific route
     */
    clearScrollPosition(route: string): void {
        this.scrollPositions.delete(route);
        try {
            sessionStorage.removeItem(this.STORAGE_KEY);
        } catch (e) {
            console.warn('Could not clear scroll position from sessionStorage', e);
        }
    }

    /**
     * Clears all saved scroll positions
     */
    clearAllScrollPositions(): void {
        this.scrollPositions.clear();
        try {
            sessionStorage.removeItem(this.STORAGE_KEY);
        } catch (e) {
            console.warn('Could not clear all scroll positions from sessionStorage', e);
        }
    }
}
