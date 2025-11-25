import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ScrollPositionService {
    private scrollPositions = new Map<string, number>();
    private readonly STORAGE_KEY = 'meme-list-scroll-position';

    constructor() { }

    /**
     * Salva la posizione di scroll corrente per una route specifica
     */
    saveScrollPosition(route: string, position: number): void {
        this.scrollPositions.set(route, position);
        // Salva anche in sessionStorage per persistenza durante refresh
        try {
            sessionStorage.setItem(this.STORAGE_KEY, position.toString());
        } catch (e) {
            // Ignora errori di storage (es. modalità privata)
            console.warn('Could not save scroll position to sessionStorage', e);
        }
    }

    /**
     * Recupera la posizione di scroll salvata per una route specifica
     */
    getScrollPosition(route: string): number | null {
        // Prova prima dalla memoria
        const memoryPosition = this.scrollPositions.get(route);
        if (memoryPosition !== undefined) {
            return memoryPosition;
        }

        // Fallback a sessionStorage
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
     * Cancella la posizione di scroll salvata per una route specifica
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
     * Cancella tutte le posizioni di scroll salvate
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
