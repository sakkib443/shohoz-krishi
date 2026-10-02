"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiX } from 'react-icons/fi';
import { useGetCategoriesQuery } from '@/redux/api/categoryApi';

interface Category {
    _id: string;
    name: string;
    slug: string;
    icon?: string;
    image?: string;
}

interface CategoryExpertiseProps {
    onClose?: () => void;
}

const ICON_MAP: { keywords: string[]; icon: string }[] = [
    { keywords: ['construction', 'engineering', 'civil', 'architect'],                              icon: '🏗️' },
    { keywords: ['electrical', 'electronics', 'electric'],                                          icon: '⚡' },
    { keywords: ['family', 'kids', 'daily care', 'baby', 'child'],                                 icon: '👨‍👩‍👧‍👦' },
    { keywords: ['fashion', 'personal style', 'clothing', 'apparel', 'garment'],                   icon: '👗' },
    { keywords: ['home & lifestyle', 'home and lifestyle', 'lifestyle', 'home decor', 'interior', 'furniture', 'kitchen'], icon: '🏠' },
    { keywords: ['industrial', 'manufacturing', 'factory', 'machinery'],                            icon: '🏭' },
    { keywords: ['agriculture', 'food industry', 'farming', 'agro'],                               icon: '🌾' },
    { keywords: ['auto', 'vehicle', 'motor', 'car', 'bike', 'truck'],                             icon: '🚗' },
    { keywords: ['sport', 'fitness', 'gym', 'exercise', 'outdoor'],                               icon: '⚽' },
    { keywords: ['health', 'beauty', 'cosmetic', 'skincare', 'medical', 'pharma', 'wellness'],    icon: '💊' },
    { keywords: ['toy', 'game', 'play', 'puzzle'],                                                 icon: '🧸' },
    { keywords: ['bag', 'luggage', 'backpack', 'suitcase'],                                        icon: '👜' },
    { keywords: ['shoe', 'footwear', 'sneaker', 'sandal', 'boot'],                                icon: '👟' },
    { keywords: ['watch', 'jewel', 'accessories', 'sunglass'],                                     icon: '⌚' },
    { keywords: ['gadget', 'tool', 'hardware', 'equipment'],                                       icon: '🔧' },
    { keywords: ['book', 'stationery', 'education', 'office', 'school'],                          icon: '📚' },
    { keywords: ['phone', 'smartphone', 'mobile', 'tablet'],                                       icon: '📱' },
    { keywords: ['computer', 'laptop', 'pc', 'desktop'],                                           icon: '💻' },
    { keywords: ['grocery', 'supermarket', 'vegetable', 'fruit', 'food', 'restaurant', 'catering', 'bakery'], icon: '🛒' },
    { keywords: ['pet', 'animal', 'dog', 'cat', 'bird'],                                          icon: '🐾' },
    { keywords: ['energy', 'solar', 'power', 'oil', 'gas'],                                       icon: '🔋' },
    { keywords: ['chemical', 'plastic', 'rubber', 'material'],                                     icon: '🧪' },
    { keywords: ['security', 'safety', 'surveillance', 'cctv'],                                   icon: '🔒' },
    { keywords: ['textile', 'fabric', 'yarn', 'thread'],                                          icon: '🧵' },
    { keywords: ['printing', 'packaging', 'paper', 'cardboard'],                                  icon: '🖨️' },
];

function resolveIcon(name: string, dbIcon?: string): string {
    if (dbIcon && dbIcon.length <= 8) return dbIcon; // emoji from DB preferred
    const lower = name.toLowerCase();
    for (const entry of ICON_MAP) {
        if (entry.keywords.some(kw => lower.includes(kw))) return entry.icon;
    }
    return '📦';
}

const LOCAL_CATEGORY_IMAGES: Record<string, string> = {
    seeds: '/categories/seeds.svg',
    fertilizers: '/categories/fertilizers.svg',
    pesticides: '/categories/pesticides.svg',
    'farm-tools': '/categories/farm-tools.svg',
    irrigation: '/categories/irrigation.svg',
    'animal-feed': '/categories/animal-feed.svg',
    saplings: '/categories/saplings.svg',
    'garden-nursery': '/categories/garden-nursery.svg',
};

const FALLBACK_CATEGORIES: Category[] = [
    { _id: 'f-seeds',           name: 'Seeds',            slug: 'seeds',           icon: '🌱', image: LOCAL_CATEGORY_IMAGES['seeds'] },
    { _id: 'f-fertilizers',     name: 'Fertilizers',      slug: 'fertilizers',     icon: '🌿', image: LOCAL_CATEGORY_IMAGES['fertilizers'] },
    { _id: 'f-pesticides',      name: 'Pesticides',       slug: 'pesticides',      icon: '🧴', image: LOCAL_CATEGORY_IMAGES['pesticides'] },
    { _id: 'f-farm-tools',      name: 'Farm Tools',       slug: 'farm-tools',      icon: '🧰', image: LOCAL_CATEGORY_IMAGES['farm-tools'] },
    { _id: 'f-irrigation',      name: 'Irrigation',       slug: 'irrigation',      icon: '💧', image: LOCAL_CATEGORY_IMAGES['irrigation'] },
    { _id: 'f-animal-feed',     name: 'Animal Feed',      slug: 'animal-feed',     icon: '🐄', image: LOCAL_CATEGORY_IMAGES['animal-feed'] },
    { _id: 'f-saplings',        name: 'Saplings',         slug: 'saplings',        icon: '🌳', image: LOCAL_CATEGORY_IMAGES['saplings'] },
    { _id: 'f-garden-nursery',  name: 'Garden & Nursery', slug: 'garden-nursery',  icon: '🪴', image: LOCAL_CATEGORY_IMAGES['garden-nursery'] },
];

function categoryImage(cat: Category): string | undefined {
    const dbImg = cat.image || (cat.icon && (cat.icon.startsWith('http') || cat.icon.startsWith('/')) ? cat.icon : undefined);
    const isStockPhoto = Boolean(dbImg && (dbImg.includes('unsplash.com') || dbImg.includes('picsum.photos')));
    if (dbImg && !isStockPhoto) return dbImg;
    return LOCAL_CATEGORY_IMAGES[cat.slug] || dbImg;
}

const CategoryExpertise: React.FC<CategoryExpertiseProps> = ({ onClose }) => {
    const { data: categoriesData } = useGetCategoriesQuery({});
    const apiCategories: Category[] = categoriesData?.data || [];
    const categories: Category[] = apiCategories.length > 0 ? apiCategories : FALLBACK_CATEGORIES;

    return (
        <section className="w-full bg-white border-b border-gray-100">
            <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5">

                {/* Header row */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                        <span
                            className="w-[3px] h-5 rounded-full"
                            style={{ background: 'var(--color-primary)' }}
                        />
                        <h2 className="text-sm sm:text-base font-bold text-gray-800 tracking-tight">
                            Featured Categories
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href="/products"
                            className="text-xs font-semibold hover:underline"
                            style={{ color: 'var(--color-primary)' }}
                        >
                            View All →
                        </Link>
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="ml-1 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <FiX size={13} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Full-width grid — no carousel, no arrows. The column count is
                    chosen so a row of 6 or 8 categories fills the container exactly;
                    the tiles are square and stretch to whatever width is left over. */}
                <div className="grid grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4">
                    {categories.map(cat => (
                        <Link
                            key={cat._id}
                            href={`/products?category=${cat._id}`}
                            className="group flex flex-col items-center gap-2.5"
                        >
                            {/* Icon tile — square, fills its grid column */}
                            <div className="relative w-full aspect-square rounded-2xl overflow-hidden transition-all duration-200 group-hover:shadow-lg">
                                {categoryImage(cat) ? (
                                    <Image
                                        src={categoryImage(cat)!}
                                        alt={cat.name}
                                        fill
                                        // A tile is a fraction of the row on phones and
                                        // ~150px on desktop; never the full 400px source.
                                        sizes="(max-width: 640px) 25vw, (max-width: 1024px) 15vw, 150px"
                                        className="object-cover select-none transition-transform duration-200 group-hover:scale-105"
                                    />
                                ) : (
                                    <span className="text-5xl sm:text-7xl select-none transition-transform duration-200 group-hover:scale-110">
                                        {resolveIcon(cat.name, cat.icon)}
                                    </span>
                                )}
                            </div>

                            {/* Label */}
                            <span className="w-full text-[12px] sm:text-[14px] font-semibold text-gray-700 text-center leading-snug transition-colors group-hover:text-[var(--color-primary)]">
                                {cat.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryExpertise;
